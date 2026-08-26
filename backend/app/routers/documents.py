import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models import Document, User
from app.schemas import DocumentRead
from app.services.chunking import chunk_text
from app.services.document_processor import extract_text
from app.services.embeddings import embed_texts
from app.services.vector_store import add_chunks

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/upload", response_model=DocumentRead)
def upload_document(
    file: UploadFile,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format tidak didukung. Gunakan salah satu dari: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # simpan file fisik dengan nama unik agar tidak bentrok antar user
    stored_filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / stored_filename
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    document = Document(
        user_id=current_user.id,
        filename=stored_filename,
        original_name=file.filename,
        status="pending",
    )
    session.add(document)
    session.commit()
    session.refresh(document)

    # proses ingestion: extract -> chunk -> embed -> simpan ke vector store
    try:
        text = extract_text(str(file_path))
        if not text.strip():
            raise ValueError("Tidak ada teks yang berhasil diekstrak dari dokumen (mungkin scan/gambar)")

        chunks = chunk_text(text)
        if not chunks:
            raise ValueError("Dokumen tidak menghasilkan chunk apa pun")

        embeddings = embed_texts(chunks)
        add_chunks(
            document_id=document.id,
            user_id=current_user.id,
            original_name=document.original_name,
            chunks=chunks,
            embeddings=embeddings,
        )

        document.status = "processed"
        document.chunk_count = len(chunks)
    except Exception as e:
        document.status = "failed"
        session.add(document)
        session.commit()
        raise HTTPException(status_code=500, detail=f"Gagal memproses dokumen: {e}")

    session.add(document)
    session.commit()
    session.refresh(document)
    return document


@router.get("/", response_model=list[DocumentRead])
def list_documents(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    documents = session.exec(
        select(Document).where(Document.user_id == current_user.id).order_by(Document.uploaded_at.desc())
    ).all()
    return documents
