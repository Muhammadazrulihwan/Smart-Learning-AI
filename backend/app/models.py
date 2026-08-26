from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Document(SQLModel, table=True):
    """Metadata dokumen yang diupload. Isi/embedding-nya disimpan terpisah di ChromaDB (Fase 2)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    filename: str  # nama file tersimpan di disk
    original_name: str  # nama asli saat diupload user
    status: str = Field(default="pending")  # pending | processed | failed
    chunk_count: Optional[int] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class ChatHistory(SQLModel, table=True):
    """Riwayat tanya-jawab RAG (diisi mulai Fase 3)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    document_id: Optional[int] = Field(default=None, foreign_key="document.id")
    question: str
    answer: str
    sources: Optional[str] = None  # disimpan sebagai JSON string (list referensi sumber)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Quiz(SQLModel, table=True):
    """Soal kuis hasil generate dari dokumen (diisi mulai Fase 4)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="document.id")
    user_id: int = Field(foreign_key="user.id", index=True)
    topic: Optional[str] = None
    question_type: str = Field(default="multiple_choice")  # multiple_choice | essay
    question: str
    options: Optional[str] = None  # JSON string, null untuk essay
    correct_answer: str
    explanation: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class QuizResult(SQLModel, table=True):
    """Jawaban user atas suatu quiz + apakah benar (diisi mulai Fase 4)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: int = Field(foreign_key="quiz.id")
    user_id: int = Field(foreign_key="user.id", index=True)
    user_answer: str
    is_correct: bool
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class StudyPlan(SQLModel, table=True):
    """Rekomendasi topik belajar berdasarkan hasil quiz (diisi mulai Fase 5)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    topic: str
    priority: int  # 1 = paling prioritas
    recommendation: Optional[str] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)
