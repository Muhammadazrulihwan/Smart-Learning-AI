from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: str


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class DocumentRead(BaseModel):
    id: int
    original_name: str
    status: str
    chunk_count: int | None = None


class ChatRequest(BaseModel):
    document_id: int
    question: str


class SourceRef(BaseModel):
    source_name: str
    chunk_index: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceRef]

class QuizGenerateRequest(BaseModel):
    document_id: int
    num_questions: int = 5


class QuizQuestionPublic(BaseModel):
    """Yang dikirim ke user SAAT mengerjakan kuis - tidak ada correct_answer di sini."""
    id: int
    topic: str | None = None
    question_type: str
    question: str
    options: list[str] | None = None


class QuizSubmitRequest(BaseModel):
    user_answer: str


class QuizSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str | None = None