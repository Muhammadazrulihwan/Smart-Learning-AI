# Setup Project — Fase 0 & Fase 1

Ikuti langkah ini secara urut. Jangan lanjut ke langkah berikutnya kalau langkah sebelumnya belum ✅.

## Fase 0 — Persiapan & Setup Environment

### 1. Setup Backend (Python)

```bash
cd backend

# buat virtual environment
python -m venv venv

# aktifkan (Windows)
venv\Scripts\activate
# aktifkan (Mac/Linux)
source venv/bin/activate

# install dependencies
pip install -r requirements.txt
```

### 2. Setup API Key Gemini

1. Buka https://aistudio.google.com/apikey, buat API key baru (gratis, tanpa kartu kredit)
2. Copy `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. Buka `.env`, isi `GEMINI_API_KEY` dengan key yang kamu dapat
4. Isi juga `JWT_SECRET_KEY` dengan string acak (jalankan perintah ini untuk generate):
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

### 3. Validasi Koneksi Gemini API

**Ini wajib jalan dulu sebelum lanjut** — memastikan API key benar dan kuota tersedia:

```bash
python scripts/test_gemini.py
```

Kalau muncul ✅ di kedua tes (text generation & embedding), lanjut ke langkah berikutnya. Kalau ❌, cek kembali API key di `.env`.

### 4. Setup Frontend (React)

Di terminal terpisah:

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev
```

Buka `http://localhost:5173` di browser — pastikan halaman default Vite+React muncul.

### 5. Siapkan Dokumen Uji

Masukkan 3-5 dokumen materi kuliah/praktikum (PDF/DOCX) ke folder:
```
data/sample_docs/
```
Dokumen ini akan dipakai untuk menguji RAG pipeline mulai Fase 2.

---

## Fase 1 — Database & Struktur Backend Dasar

Struktur backend sudah dibuatkan (lihat `backend/app/`):

```
backend/
├── main.py                  # entry point FastAPI
├── app/
│   ├── database.py          # koneksi SQLite (SQLModel)
│   ├── models.py            # skema tabel: User, Document, ChatHistory, Quiz, QuizResult, StudyPlan
│   ├── schemas.py           # request/response schema (Pydantic)
│   ├── auth_utils.py        # hashing password & JWT
│   ├── dependencies.py      # dependency get_current_user
│   └── routers/
│       └── auth.py          # endpoint register/login/me
```

### Jalankan Backend

```bash
cd backend
uvicorn main:app --reload
```

Buka `http://127.0.0.1:8000/docs` — Swagger UI otomatis muncul dengan endpoint:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Tes Alur Auth Lewat Swagger UI

1. Buka `POST /auth/register`, klik "Try it out", isi username/email/password, Execute → harus dapat response 201 dengan data user
2. Buka `POST /auth/login`, masukkan username & password yang sama → harus dapat `access_token`
3. Klik tombol "Authorize" di kanan atas Swagger UI, masukkan token yang didapat
4. Coba `GET /auth/me` → harus mengembalikan data user yang sedang login

Kalau semua ini jalan, database & auth dasar sudah siap. File `app.db` (SQLite) akan otomatis muncul di folder `backend/`.

### Checklist Selesai Fase 0 & 1

- [ ] `python scripts/test_gemini.py` menunjukkan ✅ untuk text generation dan embedding
- [ ] Frontend Vite+React jalan di `localhost:5173`
- [ ] Backend FastAPI jalan di `localhost:8000`, `/docs` bisa diakses
- [ ] Register → Login → `/auth/me` berhasil lewat Swagger UI
- [ ] File `app.db` sudah muncul otomatis di folder `backend/`
- [ ] Minimal 3 dokumen materi kuliah/praktikum sudah ada di `data/sample_docs/`

Kalau semua checklist ✅, lanjut ke Fase 2.

---

## Fase 2 — RAG Pipeline: Ingestion Dokumen

Struktur baru yang ditambahkan:

```
backend/app/services/
├── document_processor.py   # ekstrak teks dari PDF/DOCX/TXT
├── chunking.py              # pecah teks jadi chunk dengan overlap
├── embeddings.py            # wrapper Gemini Embedding API
└── vector_store.py          # wrapper ChromaDB (simpan & cari chunk)

backend/app/routers/
└── documents.py             # endpoint POST /documents/upload, GET /documents/
```

### Install dependency baru

```bash
cd backend
pip install -r requirements.txt
```

### Alur ingestion (otomatis saat upload)

```
Upload file -> extract_text() -> chunk_text() -> embed_texts() -> vector_store.add_chunks()
                                                                          |
                                                                    ChromaDB (chroma_data/)
```

### Tes Lewat Swagger UI

1. Jalankan `uvicorn main:app --reload`, buka `/docs`
2. Authorize dengan token dari `/auth/login` (lihat Fase 1)
3. `POST /documents/upload` — upload salah satu dokumen dari `data/sample_docs/`
4. Response harus `status: "processed"` dengan `chunk_count` > 0
5. `GET /documents/` — pastikan dokumen muncul di daftar

Kalau `status` malah `"failed"`, cek pesan error di response — biasanya karena PDF hasil scan (tidak ada teks yang bisa diekstrak) atau API key embedding bermasalah.

### Checklist Fase 2

- [ ] Upload dokumen menghasilkan `status: "processed"` dan `chunk_count` masuk akal (bukan 0)
- [ ] Folder `backend/chroma_data/` otomatis terisi setelah upload
- [ ] Coba upload dokumen kedua, `GET /documents/` menampilkan keduanya

---

## Fase 3 — RAG Pipeline: Retrieval & Q&A

Struktur baru:

```
backend/app/services/
└── rag.py                   # retrieval + prompt template + generate jawaban

backend/app/routers/
└── chat.py                  # endpoint POST /chat/ask, GET /chat/history/{document_id}
```

### Alur Q&A

```
Pertanyaan user -> embed_query() -> vector_store.query_chunks() (ambil top-5 relevan)
                                            |
                        prompt = SYSTEM_PROMPT + konteks chunk + pertanyaan
                                            |
                              Gemini generate_content()
                                            |
                              Jawaban + daftar sumber
```

Prompt di `rag.py` (`SYSTEM_PROMPT`) secara eksplisit menginstruksikan model untuk **hanya menjawab dari konteks** dan mengaku terus terang kalau jawabannya tidak ada di dokumen — ini kunci untuk menghindari halusinasi (FR-7 di PRD).

### Tes Lewat Swagger UI

1. `POST /chat/ask` dengan body:
   ```json
   {
     "document_id": 1,
     "question": "Coba tanyakan sesuatu yang ADA di dokumen tersebut"
   }
   ```
   → cek jawabannya relevan dan `sources` menunjuk ke dokumen yang benar

2. Coba lagi dengan pertanyaan yang **jawabannya TIDAK ADA** di dokumen
   → pastikan model mengaku tidak tahu, bukan mengarang jawaban (ini tes paling penting!)

3. `GET /chat/history/1` — pastikan riwayat tanya-jawab tersimpan

### Checklist Fase 3

- [ ] Pertanyaan yang jawabannya ADA di dokumen → jawaban relevan + sumber benar
- [ ] Pertanyaan yang jawabannya TIDAK ADA di dokumen → model mengaku tidak tahu (bukan halusinasi)
- [ ] Riwayat chat tersimpan dan bisa diambil lewat `/chat/history/{document_id}`

Kalau semua checklist Fase 2 & 3 ✅, fondasi RAG-mu sudah solid — lanjut ke **Fase 4 (Quiz Generation)**, yang akan memakai ulang `vector_store.py` dan pola prompt yang sama.
