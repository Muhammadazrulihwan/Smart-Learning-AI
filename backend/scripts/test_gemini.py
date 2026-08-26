"""
Skrip untuk memvalidasi koneksi ke Gemini API sebelum lanjut development.
Jalankan dari folder backend/: python scripts/test_gemini.py
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    print("❌ GEMINI_API_KEY belum diisi di file .env")
    sys.exit(1)

from google import genai

client = genai.Client(api_key=api_key)

print("=== Tes 1: Text Generation (Gemini Flash) ===")
try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Jawab singkat: apa itu RAG dalam konteks AI?",
    )
    print("✅ Berhasil. Contoh respons:")
    print(response.text[:300], "...\n")
except Exception as e:
    print(f"❌ Gagal generate_content: {e}\n")

print("=== Tes 2: Embedding (untuk RAG pipeline) ===")
try:
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents="Contoh kalimat untuk diuji embedding-nya.",
    )
    embedding_vector = response.embeddings[0].values
    print(f"✅ Berhasil. Panjang vector embedding: {len(embedding_vector)}")
    print(f"   5 nilai pertama: {embedding_vector[:5]}\n")
except Exception as e:
    print(f"❌ Gagal embed_content: {e}\n")

print("Selesai. Kalau kedua tes ✅, kamu siap lanjut ke Fase 1.")
