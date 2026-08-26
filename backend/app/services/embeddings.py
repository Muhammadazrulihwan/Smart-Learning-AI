"""Wrapper untuk Gemini Embedding API (Fase 2 & 3).

Model yang sama (gemini-embedding-001) dipakai untuk embed dokumen (saat ingestion)
maupun embed pertanyaan user (saat retrieval), supaya berada di ruang vektor yang sama.
"""
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

EMBEDDING_MODEL = "gemini-embedding-001"


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed banyak teks sekaligus (dipakai saat ingestion dokumen)."""
    if not texts:
        return []
    response = _client.models.embed_content(model=EMBEDDING_MODEL, contents=texts)
    return [item.values for item in response.embeddings]


def embed_query(text: str) -> list[float]:
    """Embed satu teks (dipakai saat user bertanya)."""
    response = _client.models.embed_content(model=EMBEDDING_MODEL, contents=text)
    return response.embeddings[0].values
