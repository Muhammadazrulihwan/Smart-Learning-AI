"""Generate soal kuis otomatis dari dokumen menggunakan Gemini (Fase 4)."""
import json
import os
import re
import time

from dotenv import load_dotenv
from google import genai
from google.genai import errors as genai_errors

from app.services.vector_store import get_document_chunks

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
GENERATION_MODEL = "gemini-2.5-flash"

QUIZ_PROMPT_TEMPLATE = """Kamu adalah asisten praktikum yang membuat soal latihan untuk mahasiswa
berdasarkan materi kuliah berikut ini.

MATERI:
{context}

Buatkan {num_questions} soal pilihan ganda berdasarkan materi di atas. Soal harus menyebar
mencakup topik-topik berbeda yang ada di materi, jangan hanya dari satu bagian saja.

Balas HANYA dengan JSON array (tanpa teks lain, tanpa markdown code fence), dengan format
setiap elemen persis seperti ini:
{{
  "topic": "nama topik singkat soal ini",
  "question": "teks pertanyaan",
  "options": ["pilihan A", "pilihan B", "pilihan C", "pilihan D"],
  "correct_answer": "isi pilihan yang benar (harus sama persis dengan salah satu di options)",
  "explanation": "penjelasan singkat kenapa jawaban itu benar"
}}

Jangan menambahkan teks apa pun sebelum atau sesudah JSON array tersebut."""


def _extract_json(raw_text: str) -> list[dict]:
    """Bersihkan output Gemini (kadang dibungkus ```json ... ```) lalu parse jadi JSON."""
    text = raw_text.strip()
    # buang code fence kalau ada
    text = re.sub(r"^```(json)?", "", text.strip())
    text = re.sub(r"```$", "", text.strip())
    text = text.strip()
    return json.loads(text)


def _generate_with_retry(prompt: str, max_retries: int = 3) -> str:
    last_error = None
    for attempt in range(max_retries):
        try:
            response = _client.models.generate_content(model=GENERATION_MODEL, contents=prompt)
            return response.text
        except genai_errors.ServerError as e:
            last_error = e
            if attempt < max_retries - 1:
                time.sleep(2 ** (attempt + 1))
                continue
    raise RuntimeError(
        f"Gemini API sedang tidak bisa diakses setelah {max_retries} percobaan. Detail: {last_error}"
    )


def generate_quiz_questions(document_id: int, user_id: int, num_questions: int = 5) -> list[dict]:
    """
    Ambil sample chunk dari dokumen, minta Gemini generate soal, parse hasilnya.
    Mengembalikan list of dict siap disimpan ke tabel Quiz.
    Raise ValueError kalau dokumen belum punya chunk sama sekali.
    Raise RuntimeError kalau Gemini gagal / hasilnya bukan JSON valid.
    """
    chunks = get_document_chunks(document_id=document_id, user_id=user_id, limit=15)
    if not chunks:
        raise ValueError("Dokumen belum diproses atau tidak ditemukan. Upload dan proses dokumen dulu.")

    context = "\n\n---\n\n".join(c["text"] for c in chunks)
    prompt = QUIZ_PROMPT_TEMPLATE.format(context=context, num_questions=num_questions)

    raw_response = _generate_with_retry(prompt)

    try:
        questions = _extract_json(raw_response)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Gagal parse hasil generate soal dari Gemini (bukan JSON valid): {e}")

    # validasi struktur minimal tiap soal
    validated = []
    for q in questions:
        if not all(k in q for k in ("question", "options", "correct_answer")):
            continue  # skip soal yang formatnya tidak lengkap
        validated.append(q)

    if not validated:
        raise RuntimeError("Gemini tidak menghasilkan soal yang valid. Coba generate ulang.")

    return validated