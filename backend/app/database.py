import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# check_same_thread=False dibutuhkan karena SQLite + FastAPI (multi-request)
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db() -> None:
    """Membuat semua tabel jika belum ada. Dipanggil sekali saat startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency untuk endpoint FastAPI — satu session per request."""
    with Session(engine) as session:
        yield session
