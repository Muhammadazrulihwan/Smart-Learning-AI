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
