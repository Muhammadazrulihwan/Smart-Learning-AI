"""Ekstraksi teks mentah dari berbagai format dokumen (Fase 2)."""
from pathlib import Path

from pypdf import PdfReader
from docx import Document as DocxDocument


def extract_text(file_path: str) -> str:
    """Ekstrak teks dari file berdasarkan ekstensinya. Mengembalikan string kosong kalau gagal."""
    ext = Path(file_path).suffix.lower()

    if ext == ".pdf":
        return _extract_pdf(file_path)
    elif ext == ".docx":
        return _extract_docx(file_path)
    elif ext == ".txt":
        return _extract_txt(file_path)
    else:
        raise ValueError(f"Format file tidak didukung: {ext}")


def _extract_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text)
    return "\n\n".join(pages_text)


def _extract_docx(file_path: str) -> str:
    doc = DocxDocument(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs)


def _extract_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()
