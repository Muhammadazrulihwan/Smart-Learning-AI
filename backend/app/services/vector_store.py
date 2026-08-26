"""Wrapper ChromaDB — tempat menyimpan & mencari chunk embedding (Fase 2 & 3)."""
import os

import chromadb
from dotenv import load_dotenv

load_dotenv()

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
COLLECTION_NAME = "document_chunks"

_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
_collection = _client.get_or_create_collection(name=COLLECTION_NAME)


def add_chunks(
    document_id: int,
    user_id: int,
    original_name: str,
    chunks: list[str],
    embeddings: list[list[float]],
) -> None:
    """Simpan chunk + embedding sebuah dokumen ke ChromaDB."""
    ids = [f"doc{document_id}_chunk{i}" for i in range(len(chunks))]
    metadatas = [
        {
            "document_id": document_id,
            "user_id": user_id,
            "source_name": original_name,
            "chunk_index": i,
        }
        for i in range(len(chunks))
    ]
    _collection.add(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadatas)


def query_chunks(
    query_embedding: list[float],
    user_id: int,
    document_id: int,
    top_k: int = 5,
) -> list[dict]:
    """Cari chunk paling relevan untuk sebuah query, dibatasi ke user & dokumen tertentu."""
    results = _collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"$and": [{"user_id": user_id}, {"document_id": document_id}]},
    )

    chunks = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for text, meta, distance in zip(docs, metas, distances):
        chunks.append({"text": text, "metadata": meta, "distance": distance})

    return chunks


def delete_document_chunks(document_id: int) -> None:
    """Hapus semua chunk milik sebuah dokumen (dipakai kalau dokumen dihapus/re-upload)."""
    _collection.delete(where={"document_id": document_id})
