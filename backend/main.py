from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import auth, chat, documents


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # buat tabel SQLite kalau belum ada
    yield


app = FastAPI(title="AI Smart Learning Companion API", lifespan=lifespan)

# Izinkan frontend React (default Vite: localhost:5173) mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "AI Smart Learning Companion API is running"}
