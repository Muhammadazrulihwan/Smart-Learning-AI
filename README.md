# StudyAI — AI-Powered Smart Learning Companion

Platform pembelajaran adaptif berbasis AI yang membantu mahasiswa belajar mandiri dengan personalisasi, tanya-jawab instan berbasis dokumen (RAG), kuis otomatis dengan tingkat kesulitan adaptif, dan rekomendasi belajar personal — dibangun sebagai project pembelajaran penerapan **Retrieval-Augmented Generation (RAG)** di dunia nyata.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61DAFB)
![LLM](https://img.shields.io/badge/LLM-Google%20Gemini-4285F4)
![Vector DB](https://img.shields.io/badge/vector%20db-ChromaDB-orange)

---

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Project](#struktur-project)
- [Cara Menjalankan](#cara-menjalankan)
- [Dokumentasi API](#dokumentasi-api)
- [Roadmap](#roadmap)
- [Kontributor](#kontributor)

---

## Latar Belakang

Mahasiswa sering menghadapi beberapa masalah saat belajar mandiri:

- Sistem pembelajaran tradisional tidak adaptif terhadap kebutuhan tiap individu
- Metode pengajaran satu arah gagal mengakomodasi gaya belajar yang berbeda-beda
- Sulit memahami konsep kompleks tanpa pendampingan langsung
- Tidak ada klarifikasi instan saat menemui kebingungan di luar jam kuliah/praktikum
- Platform belajar yang ada jarang memberi feedback performa secara real-time

**StudyAI** dibangun untuk menjawab masalah ini dengan memanfaatkan RAG: mahasiswa upload materi kuliah mereka sendiri, lalu AI membantu memahami, menguji, dan merencanakan proses belajar mereka — berdasarkan konten materi asli, bukan jawaban generik.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📄 **Upload & Proses Dokumen** | Upload PDF/DOCX/TXT, otomatis diekstrak, di-chunk, dan di-embed ke vector database |
| 💬 **Tanya-Jawab per Dokumen** | Chat dengan AI berbasis isi satu dokumen tertentu, lengkap dengan sumber referensi |
| 🌐 **Tanya AI Lintas Dokumen** | Bertanya bebas tanpa perlu pilih dokumen — AI mencari jawaban dari seluruh materi yang sudah diupload sekaligus |
| 🧠 **Anti-Halusinasi** | AI hanya menjawab dari isi dokumen; jujur mengaku tidak tahu kalau informasinya tidak tersedia |
| 📝 **Generate Kuis Otomatis** | Soal pilihan ganda dibuat otomatis dari materi, tersebar ke berbagai topik |
| 🎯 **Adaptive Difficulty** | Tingkat kesulitan soal menyesuaikan performa mahasiswa di dokumen tersebut sebelumnya |
| 📊 **Personalized Study Plan** | Rekomendasi topik belajar terurut dari yang paling lemah, berdasarkan riwayat kuis |
| 🗑️ **Kelola Riwayat Chat** | Riwayat percakapan tersimpan otomatis, dengan opsi untuk membersihkannya kapan saja |

---

## Tech Stack

**Backend**
- Python + [FastAPI](https://fastapi.tiangolo.com/)
- [SQLModel](https://sqlmodel.tiangolo.com/) + SQLite (data user, dokumen, kuis, riwayat)
- [ChromaDB](https://www.trychroma.com/) (vector database, embedded/local)
- [Google Gemini API](https://ai.google.dev/) — `gemini-2.5-flash` untuk generation, `gemini-embedding-001` untuk embedding
- JWT (OAuth2PasswordBearer) untuk autentikasi

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS v4
- Desain: dark mode, glassmorphism + efek glow

---

## Arsitektur

```
                    ┌─────────────┐
                    │   Frontend   │  React + TypeScript (Vite)
                    │   (React)    │  localhost:5173
                    └──────┬───────┘
                           │ REST API (JWT Bearer)
                    ┌──────▼───────┐
                    │   Backend    │  FastAPI
                    │  (FastAPI)   │  localhost:8000
                    └──┬───────┬───┘
                       │       │
              ┌────────▼──┐  ┌─▼──────────┐
              │  SQLite    │  │  ChromaDB   │
              │ (relasional)│  │ (vector db) │
              └────────────┘  └─────────────┘
                       │
                ┌──────▼───────┐
                │ Google Gemini │
                │      API      │
                └───────────────┘
```

**Alur RAG (inti sistem):**
```
Upload Dokumen → Ekstraksi Teks → Chunking → Embedding → Simpan ke ChromaDB
                                                                  │
Pertanyaan User → Embed Query → Retrieval Chunk Relevan ─────────┘
                                        │
                     Prompt (context + pertanyaan) → Gemini → Jawaban + Sumber
```

---

## Struktur Project

```
.
├── backend/
│   ├── app/
│   │   ├── models.py           # Skema tabel: User, Document, ChatHistory, Quiz, QuizResult, StudyPlan
│   │   ├── schemas.py          # Request/response schema (Pydantic)
│   │   ├── database.py         # Koneksi SQLite
│   │   ├── auth_utils.py       # Hashing password & JWT
│   │   ├── dependencies.py     # Dependency get_current_user
│   │   ├── routers/            # Endpoint: auth, documents, chat, quiz, study_plan
│   │   └── services/           # Logika inti: chunking, embeddings, vector_store, rag, quiz_generation, study_plan
│   ├── main.py                 # Entry point FastAPI
│   ├── requirements.txt
│   └── scripts/test_gemini.py  # Validasi koneksi Gemini API
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Layer pemanggilan backend (auth, documents, chat, quiz, studyPlan)
│   │   ├── context/             # AuthContext (state login global)
│   │   ├── components/          # Navbar, AuthScreen, UploadModal, DashboardView, DocumentDetailView, GeneralChatView, StudyPlanView
│   │   ├── types.ts              # Tipe data, mengikuti schema backend
│   │   └── App.tsx
│   └── package.json
│
└── data/sample_docs/            # Contoh materi kuliah untuk testing
```

---

## Cara Menjalankan

### Prasyarat
- Python 3.11 atau 3.12 (disarankan; beberapa dependency belum punya prebuilt wheel untuk versi Python terbaru di Windows)
- Node.js 18+
- API key Google Gemini (gratis) dari [Google AI Studio](https://aistudio.google.com/apikey)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

cp .env.example .env
# isi GEMINI_API_KEY dan JWT_SECRET_KEY di file .env

python scripts/test_gemini.py   # validasi API key sebelum lanjut

uvicorn main:app --reload
```

Backend jalan di `http://127.0.0.1:8000`. Dokumentasi API interaktif (Swagger UI) tersedia di `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install

cp .env.example .env   # sesuaikan VITE_API_URL kalau backend jalan di port/URL berbeda

npm run dev
```

Frontend jalan di `http://localhost:5173`.

---

## Dokumentasi API

Ringkasan endpoint utama (dokumentasi interaktif lengkap ada di `/docs` backend):

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/auth/register` | Daftar akun baru |
| POST | `/auth/login` | Login (OAuth2 form) |
| GET | `/auth/me` | Data user yang login |
| POST | `/documents/upload` | Upload & proses dokumen |
| GET | `/documents/` | List dokumen milik user |
| POST | `/chat/ask` | Tanya-jawab RAG (`document_id` opsional — kosongkan untuk cari lintas semua dokumen) |
| GET/DELETE | `/chat/history/{document_id}` | Riwayat chat per dokumen |
| GET/DELETE | `/chat/history/general` | Riwayat chat mode lintas dokumen |
| POST | `/quiz/generate` | Generate soal kuis dari dokumen |
| GET | `/quiz/document/{document_id}` | List soal tersimpan untuk dokumen |
| POST | `/quiz/{quiz_id}/submit` | Submit jawaban kuis |
| GET | `/study-plan/me` | Rekomendasi belajar personal |

---

## Roadmap

- [x] Autentikasi & manajemen dokumen
- [x] RAG pipeline: ingestion, retrieval, Q&A (per-dokumen & lintas dokumen)
- [x] Quiz generation dengan adaptive difficulty
- [x] Personalized study plan
- [x] Frontend React terintegrasi penuh
- [ ] Deploy ke cloud (saat ini masih berjalan lokal)
- [ ] Dashboard analitik progres belajar dari waktu ke waktu

---

## Kontributor

**Muhammad Azrul Ihwan**
Mahasiswa Informatika, Universitas AMIKOM Yogyakarta

Project ini dibangun sebagai penerapan konsep RAG (Retrieval-Augmented Generation) berdasarkan pengalaman sebagai asisten praktikum yang membantu mahasiswa memahami materi kuliah.
