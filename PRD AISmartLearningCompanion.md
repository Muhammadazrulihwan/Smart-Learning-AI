# Product Requirements Document (PRD)
## AI-Powered Smart Learning Companion

**Versi:** 1.0
**Tanggal:** 25 Agustus 2026
**Disusun oleh:** Azrul

---

## 1. Ringkasan Produk (Overview)

AI-Powered Smart Learning Companion adalah platform pembelajaran adaptif berbasis AI yang membantu siswa/mahasiswa belajar secara mandiri dengan dukungan personalisasi, tanya-jawab instan, dan analisis performa secara real-time. Produk ini memanfaatkan **Retrieval-Augmented Generation (RAG)** sehingga jawaban yang diberikan AI dapat bersumber langsung dari materi/dokumen yang diunggah pengguna (buku, catatan kuliah, modul), bukan hanya dari pengetahuan umum LLM.

---

## 2. Latar Belakang & Problem Statement

| # | Masalah |
|---|---------|
| 1 | Sistem pembelajaran tradisional tidak adaptif terhadap kebutuhan tiap siswa |
| 2 | Siswa kesulitan menjaga engagement dan retensi materi |
| 3 | Metode pengajaran "satu untuk semua" gagal mengakomodasi gaya belajar individu |
| 4 | Siswa kesulitan memahami konsep kompleks tanpa pendampingan |
| 5 | Tidak ada klarifikasi instan saat belajar mandiri (self-study) |
| 6 | Platform yang ada belum memberikan feedback performa secara real-time |

**Insight utama:** dibutuhkan solusi *AI-based adaptive learning* yang bisa (a) memahami dokumen/materi milik pengguna secara spesifik, dan (b) menyesuaikan cara belajar berdasarkan kebutuhan & performa individu.

**Konteks tambahan:** insight problem statement di atas juga diperkuat dari pengalaman langsung sebagai asisten praktikum, yang secara rutin mendampingi dan menjelaskan materi kepada mahasiswa — melihat langsung pola pertanyaan yang berulang, titik kesulitan pemahaman konsep, dan kebutuhan akan penjelasan/klarifikasi instan di luar jam praktikum/kelas.

---

## 3. Tujuan Produk (Goals & Objectives)

**Tujuan Bisnis/Proyek:**
- Membangun MVP AI learning companion yang dapat mendemonstrasikan penerapan RAG secara nyata (relevan untuk portofolio/capstone).
- Menyediakan pengalaman belajar yang personal dan adaptif berbasis data performa pengguna.

**Tujuan Produk:**
- Mengurangi waktu yang dibutuhkan siswa untuk menemukan jawaban atas pertanyaan dari materi belajar.
- Meningkatkan retensi belajar melalui kuis dan rencana belajar yang dipersonalisasi.
- Memberikan feedback performa secara instan dan actionable.

**Non-goals (di luar cakupan MVP):**
- Kelas live/real-time video learning.
- Marketplace kursus berbayar.
- Fitur sosial/komunitas antar pengguna (forum, chat antar siswa).

---

## 4. Target Pengguna

**Fokus utama: Mahasiswa** (bukan siswa sekolah atau pengguna umum). Alasan pemilihan segmen: materi kuliah lebih kompleks & terstruktur (cocok untuk uji kemampuan RAG menangani dokumen "berat"), serta tersedia akses langsung ke materi dan pemahaman kebutuhan pengguna dari pengalaman sebagai asisten praktikum.

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Mahasiswa Belajar Mandiri | Belajar sendiri di luar kelas/praktikum, sering stuck saat membaca materi kompleks (modul, slide, textbook) | Tanya-jawab instan berbasis dokumen sendiri, menggantikan sebagian peran asisten/dosen saat di luar jam kelas |
| Mahasiswa Persiapan Ujian/Praktikum | Butuh latihan soal & evaluasi progres sebelum ujian atau sesi praktikum | Quiz generation + tracking performa |
| Mahasiswa dengan Beban SKS Padat | Waktu terbatas, butuh belajar efisien & terarah | Rencana belajar personal (personalized study plan) berdasarkan topik yang paling lemah |

---

## 5. Ruang Lingkup (Scope)

### In-Scope (MVP)
- Upload dokumen (PDF/teks) sebagai basis materi belajar.
- RAG pipeline: chunking → embedding → vector store → retrieval → generation.
- AI-based Q&A berbasis dokumen yang diunggah.
- Quiz generation otomatis dari materi.
- Personalized study plan berdasarkan hasil kuis/progres.
- Dashboard performa dasar (nilai kuis, topik lemah).

### Out-of-Scope (MVP)
- Multi-modal input (video, audio) — dipertimbangkan untuk fase berikutnya.
- Aplikasi mobile native.
- Integrasi LMS eksternal (Moodle, Google Classroom) — fase berikutnya.

---

## 6. Functional Requirements

### 6.1 Document-Based Learning Support (RAG Core)
- **FR-1:** Pengguna dapat mengunggah dokumen (PDF, DOCX, TXT).
- **FR-2:** Sistem melakukan chunking dan embedding otomatis atas dokumen, disimpan ke vector database.
- **FR-3:** Sistem dapat melakukan retrieval potongan (chunk) paling relevan berdasarkan query pengguna.
- **FR-4:** Sistem menampilkan sumber/kutipan referensi (halaman/bagian dokumen) dari jawaban yang dihasilkan.

### 6.2 AI-Based Question Answering
- **FR-5:** Pengguna dapat bertanya bebas terkait materi yang diunggah.
- **FR-6:** Jawaban dihasilkan menggunakan LLM API dengan context dari hasil retrieval (RAG).
- **FR-7:** Jika jawaban tidak ditemukan dalam dokumen, sistem memberi tahu secara eksplisit (menghindari halusinasi).

### 6.3 Quiz Generation
- **FR-8:** Sistem dapat men-generate soal kuis (pilihan ganda/essay singkat) otomatis dari dokumen yang diunggah.
- **FR-9:** Sistem memberikan penilaian otomatis dan pembahasan jawaban.

### 6.4 Personalized Study Plan
- **FR-10:** Sistem menganalisis hasil kuis untuk mengidentifikasi topik yang lemah.
- **FR-11:** Sistem membuat rekomendasi rencana belajar (urutan topik, prioritas) berdasarkan hasil analisis.

### 6.5 Adaptive Learning Experience
- **FR-12:** Tingkat kesulitan soal/kuis menyesuaikan performa pengguna sebelumnya.
- **FR-13:** Sistem menyimpan riwayat interaksi untuk personalisasi berkelanjutan.

---

## 7. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performa | Response time Q&A < 5 detik untuk dokumen ukuran wajar (<50 halaman) |
| Skalabilitas | Vector database mampu menangani banyak dokumen per pengguna |
| Keamanan | Dokumen milik pengguna terisolasi (tidak bocor ke pengguna lain) |
| Akurasi | Jawaban RAG harus grounded pada dokumen, minimalkan halusinasi |
| Usability | UI sederhana, mudah dipakai tanpa training tambahan |
| Reliabilitas | Sistem tetap dapat menjawab (fallback) jika LLM API gagal/timeout |

---

## 8. Arsitektur Sistem (High-Level)

```
[User] 
  ├─> Upload Dokumen ──> Document Parser ──> Chunking ──> Embedding Model ──> Vector Database
  │
  └─> Query/Pertanyaan ──> Query Embedding ──> Retrieval (Vector DB) ──> Context
                                                                          │
                                                                          v
                                                        Prompt + Context ──> LLM API ──> Jawaban + Sumber
```

**Alur Quiz Generation:**
Dokumen → Retrieval topik kunci → Prompt ke LLM untuk generate soal → Simpan ke DB → Ditampilkan ke user → Hasil kuis → Update profil performa user → Feed ke modul Study Plan.

---

## 9. Teknologi yang Digunakan

**Catatan:** Project dijalankan secara lokal (belum ada rencana deploy), sehingga seluruh stack dipilih agar 100% gratis dan tanpa setup server/cloud.

| Layer | Teknologi | Keterangan |
|---|---|---|
| Bahasa Pemrograman | Python | |
| AI/LLM | Google Gemini API (Flash / Flash-Lite) | Free tier: 1.500 request/hari, tanpa kartu kredit. Hindari Gemini 2.5 Pro (limit free tier sangat ketat) |
| Embeddings | Gemini Embedding API | Satu provider untuk LLM & embeddings, menyederhanakan integrasi |
| Retrieval / Vector DB | ChromaDB (embedded/local mode) | Gratis, jalan langsung di dalam aplikasi Python, tanpa server terpisah (`PersistentClient`) |
| Penyimpanan Data Relasional | SQLite | Gratis, tanpa setup, cukup untuk data user, progres, dan hasil kuis di skala lokal/MVP |
| Backend Framework | FastAPI | Dipilih karena performa async yang baik untuk I/O-bound (panggilan LLM API & retrieval), auto-generate dokumentasi API (OpenAPI/Swagger), cocok untuk arsitektur API-first |
| Frontend | React | |

**Arsitektur API-first:** aplikasi dibangun dengan backend API terpisah (bukan server-rendered monolith), agar bisa dikonsumsi oleh web app sekarang dan aplikasi mobile di kemudian hari tanpa perlu membangun ulang logic backend.

**Rencana migrasi (jika nanti deploy):** ChromaDB → Supabase (pgvector), SQLite → PostgreSQL. Arsitektur RAG pipeline tidak perlu dirombak, hanya penggantian storage layer.

---

## 10. User Stories (Contoh)

1. *Sebagai* siswa, *saya ingin* mengunggah catatan kuliah saya, *agar* saya bisa bertanya langsung tentang isi catatan tersebut.
2. *Sebagai* siswa, *saya ingin* mendapatkan kuis otomatis dari materi yang saya unggah, *agar* saya bisa menguji pemahaman saya.
3. *Sebagai* siswa, *saya ingin* melihat rencana belajar yang dipersonalisasi, *agar* saya tahu topik mana yang perlu saya prioritaskan.
4. *Sebagai* siswa, *saya ingin* melihat sumber jawaban AI, *agar* saya bisa memverifikasi kebenarannya di dokumen asli.

---

## 11. Metrik Keberhasilan (Success Metrics)

- Tingkat akurasi jawaban RAG (relevansi terhadap dokumen sumber).
- Rata-rata waktu respons Q&A.
- Jumlah kuis yang diselesaikan per pengguna.
- Peningkatan skor kuis dari waktu ke waktu (indikator retensi belajar).
- Tingkat retention/engagement pengguna (frekuensi penggunaan mingguan).

---

## 12. Roadmap / Milestone (Contoh MVP)

| Fase | Fokus |
|---|---|
| Fase 1 | Setup RAG pipeline dasar (upload dokumen → embedding → retrieval → Q&A) |
| Fase 2 | Quiz generation dari dokumen |
| Fase 3 | Personalized study plan berdasarkan hasil kuis |
| Fase 4 | Adaptive difficulty & dashboard performa |
| Fase 5 | Testing, refinement, dan deployment |

---

## 13. Risiko & Asumsi

**Risiko:**
- Kualitas jawaban sangat bergantung pada kualitas chunking & embedding dokumen.
- Biaya LLM API bisa membengkak jika penggunaan tinggi tanpa caching.
- Potensi halusinasi jika retrieval tidak relevan/context terlalu panjang.

**Asumsi:**
- Pengguna mengunggah dokumen dalam format yang didukung dan berkualitas baik (teks dapat diekstrak).
- Tersedia akses ke LLM API dengan kuota yang cukup selama pengembangan.

---

## 14. Open Questions

Seluruh keputusan teknis utama sudah ditentukan:
- ~~LLM API~~ → **Google Gemini API (Flash/Flash-Lite, free tier)**
- ~~Vector database~~ → **ChromaDB (embedded/local), karena project dijalankan lokal**
- ~~Web murni atau perlu API terpisah untuk mobile~~ → **API-first architecture, agar siap dikembangkan ke mobile di masa depan**
- ~~Backend framework~~ → **FastAPI**
- ~~Frontend framework~~ → **React**
