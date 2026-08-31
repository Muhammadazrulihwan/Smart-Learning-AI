"""Inti RAG: retrieval chunk relevan lalu generate jawaban via Gemini (Fase 3)."""
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import errors as genai_errors

from app.services.embeddings import embed_query
from app.services.vector_store import query_chunks

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
GENERATION_MODEL = "gemini-2.5-flash"

# Instruksi ini yang mencegah halusinasi: model diminta HANYA menjawab dari context.
SYSTEM_PROMPT = """Kamu adalah asisten belajar yang membantu mahasiswa memahami materi kuliah.
Jawab pertanyaan HANYA berdasarkan konteks dokumen yang diberikan di bawah ini.
Konteks bisa berasal dari satu atau beberapa dokumen berbeda - kalau begitu, boleh gabungkan
informasinya asal tetap akurat dan sebutkan kalau infonya berasal dari materi yang berbeda-beda.

Aturan penting:
- Jika jawaban tidak ditemukan dalam konteks, katakan dengan jelas bahwa informasi tersebut
  tidak ada di dalam dokumen yang diunggah. Jangan mengarang jawaban.
- Jawab dengan bahasa yang jelas dan mudah dipahami, seperti asisten praktikum menjelaskan ke mahasiswa.
- Jangan menyebutkan kata "konteks" atau "dokumen yang diberikan" secara eksplisit ke user,
  cukup jawab seolah kamu memang menguasai materinya.
"""


def _build_prompt(question: str, context_chunks: list[dict]) -> str:
    context_text = "\n\n---\n\n".join(
        f"[Sumber: {c['metadata']['source_name']}, bagian {c['metadata']['chunk_index']}]\n{c['text']}"
        for c in context_chunks
    )
    return f"""{SYSTEM_PROMPT}

KONTEKS DOKUMEN:
{context_text}

PERTANYAAN:
{question}

JAWABAN:"""


def _generate_with_retry(prompt: str, max_retries: int = 3) -> str:
    """
    Panggil Gemini API dengan retry otomatis kalau server sedang overload (503).
    Delay antar percobaan: 2s, 4s, 8s (exponential backoff).
    """
    last_error = None
    for attempt in range(max_retries):
        try:
            response = _client.models.generate_content(model=GENERATION_MODEL, contents=prompt)
            return response.text
        except genai_errors.ServerError as e:
            last_error = e
            if attempt < max_retries - 1:
                time.sleep(2 ** (attempt + 1))  # 2s, 4s, 8s
                continue

    # Semua percobaan gagal -> lempar pesan yang jelas, jangan biarkan 500 mentah
    raise RuntimeError(
        f"Gemini API sedang tidak bisa diakses setelah {max_retries} percobaan "
        f"(server sedang sibuk/overload). Coba lagi beberapa saat lagi. Detail: {last_error}"
    )


def answer_question(question: str, user_id: int, document_id: int | None = None, top_k: int = 5) -> dict:
    """
    Alur RAG lengkap: embed query -> retrieve chunk relevan -> generate jawaban.
    document_id None -> retrieval dilakukan lintas SEMUA dokumen milik user (mode "chat umum").
    Mengembalikan dict {"answer": str, "sources": list[dict]}.
    """
    query_embedding = embed_query(question)
    relevant_chunks = query_chunks(
        query_embedding=query_embedding,
        user_id=user_id,
        document_id=document_id,
        top_k=top_k if document_id is not None else top_k + 3,  # sedikit lebih banyak untuk mode lintas dokumen
    )

    if not relevant_chunks:
        no_context_msg = (
            "Belum ada dokumen yang diproses untuk dicari jawabannya. Upload dokumen dulu ya."
            if document_id is None
            else "Dokumen ini belum diproses atau tidak ditemukan chunk yang relevan. "
                 "Pastikan dokumen sudah berhasil diupload dan diproses."
        )
        return {"answer": no_context_msg, "sources": []}

    prompt = _build_prompt(question, relevant_chunks)
    answer_text = _generate_with_retry(prompt)

    sources = [
        {
            "source_name": c["metadata"]["source_name"],
            "chunk_index": c["metadata"]["chunk_index"],
        }
        for c in relevant_chunks
    ]

    # dedup sumber (kalau ada chunk_index yang sama muncul lebih dari sekali)
    unique_sources = [dict(t) for t in {tuple(s.items()) for s in sources}]

    return {"answer": answer_text, "sources": unique_sources}