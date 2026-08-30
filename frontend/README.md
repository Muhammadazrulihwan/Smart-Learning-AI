# StudyAI Frontend

Frontend React + TypeScript + Tailwind v4, disambungkan penuh ke backend FastAPI (Fase 0-5) yang sudah kamu buat. Desain visual (glass + glow, dark mode) diadaptasi dari mockup AI Studio yang kamu generate, tapi seluruh datanya sekarang asli dari API, bukan mock.

## Setup

1. Pastikan backend sudah jalan di `http://127.0.0.1:8000` (`uvicorn main:app --reload` di folder `backend/`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Opsional) kalau backend kamu jalan di URL/port berbeda, copy `.env.example` jadi `.env` dan sesuaikan `VITE_API_URL`.
4. Jalankan dev server:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173`.

## Struktur

```
src/
├── api/            # Layer pemanggilan backend (satu file per grup endpoint)
│   ├── client.ts    # fetch wrapper generik + auto-attach token
│   ├── auth.ts       # register, login (form-encoded!), me
│   ├── documents.ts
│   ├── chat.ts
│   ├── quiz.ts
│   └── studyPlan.ts
├── context/
│   └── AuthContext.tsx   # state login global, token disimpan di localStorage
├── components/
│   ├── Navbar.tsx
│   ├── AuthScreen.tsx     # gabungan Login + Register (bukan modal, full screen)
│   ├── UploadModal.tsx
│   ├── DashboardView.tsx
│   ├── DocumentDetailView.tsx   # Tab Chat + Tab Quiz
│   └── StudyPlanView.tsx
├── types.ts         # 1:1 mengikuti schema response backend
└── App.tsx           # routing state-based (dashboard/study-plan/document-detail)
```

## Yang Diubah dari Hasil Generate AI Studio

Project asli hasil generate AI Studio pakai data mock dan beberapa fitur yang belum ada backend-nya. Berikut penyesuaian yang dilakukan:

| Perubahan | Alasan |
|---|---|
| Semua data dari mock → dari API asli (`src/api/*.ts`) | Supaya aplikasi benar-benar terhubung ke backend, bukan tampilan kosong |
| `AuthModal` → `AuthScreen` (full-screen, bukan modal di atas app) | Selama belum login, tidak ada "app" untuk ditumpangi modal-nya |
| Login pakai `application/x-www-form-urlencoded`, bukan JSON | Backend `/auth/login` pakai `OAuth2PasswordRequestForm` sesuai standar OAuth2 |
| `UploadModal`: 1 loading state, bukan progress bar bertahap palsu | Backend memproses upload secara sinkron (satu request blocking), tidak ada data progress bertahap yang bisa ditampilkan jujur |
| Dihapus: `GlobalChatDrawer`, `SettingsModal`, `AddEventModal`, `UpgradeModal`, `QuizModal` terpisah | Tidak ada endpoint backend untuk fitur-fitur ini (chat lintas dokumen, settings, kalender deadline, upgrade plan) |
| Navbar: dihapus search bar & notifikasi | Belum ada endpoint search/notifikasi di backend |
| `DocumentDetailView`: dihapus "Summary" & "Extracted Topics" hasil AI Studio (fake) | Backend tidak punya endpoint ringkasan dokumen. "Topik" sekarang diambil dari data asli: topik unik dari kuis yang sudah pernah digenerate untuk dokumen itu |
| Dihapus citation popup dengan kutipan teks presisi | Backend hanya mengembalikan `source_name` + `chunk_index`, tidak mengembalikan teks kutipan asli dari chunk |
| `StudyPlanView`: dihapus widget "Upcoming Deadlines" & progress bar mastery per topik | Tidak ada tabel deadline di backend, dan endpoint study-plan tidak mengembalikan angka mastery presisi (hanya teks rekomendasi + prioritas) |
| Quiz: skor & "mastery level up" dihitung dari respons submit asli | Sebelumnya angka "+15% Level Up" hardcoded di mockup |
| Bahasa: semua UI diterjemahkan ke Bahasa Indonesia | Konsisten dengan target user (mahasiswa Indonesia) dan bagian yang sudah dalam Bahasa Indonesia di mockup asli |
| Routing: tetap state-based (bukan React Router) | Mockup AI Studio sudah punya pola switching-view yang berfungsi baik untuk 3 halaman ini; menambah React Router di titik ini menambah kompleksitas tanpa manfaat besar untuk scope MVP. Bisa ditambahkan nanti kalau butuh URL yang bisa di-bookmark |

## Known Limitations (untuk fase lanjutan)

- Chat hanya bisa per satu dokumen dalam satu waktu (sesuai desain backend saat ini)
- Tidak ada fitur re-generate/ganti nama dokumen dari UI
- Refresh browser saat di halaman Document Detail akan kembali ke Dashboard (karena dokumen yang dipilih tidak disimpan di URL) — solusi permanen: tambahkan React Router dengan route `/documents/:id`
