# Design System — StudyAI (AI Smart Learning Companion)

**Status:** Diekstrak dari 4 mockup HTML (Login/Register, Dashboard, Document Detail, Study Plan)
**Tema:** Dark mode only, gaya "Glassmorphism + Glow"
**Font:** Manrope (headline/display) + Hanken Grotesk (body/label)
**Icon:** Google Material Symbols Outlined

Dokumen ini melengkapi `Frontend-Design.md` bagian 8 (visual design yang sebelumnya masih kosong). Kamu bisa pakai ini sebagai referensi saat implementasi komponen React dengan routing versimu sendiri.

---

## 1. Identitas Brand

- **Nama produk:** StudyAI
- **Logo:** teks "StudyAI" dengan font Manrope extra bold, warna `primary`, kadang didampingi icon Material Symbols `science` (filled) berwarna `glow-electric`
- **Tone visual:** futuristik, tenang, fokus (dark navy + aksen biru/cyan menyala) — kesan "AI companion" tanpa terasi terlalu ramai

---

## 2. Color Tokens

### Background & Surface
| Token | Hex | Pemakaian |
|---|---|---|
| `background` / `surface` | `#0d1322` | Background utama halaman |
| `surface-dim` | `#0d1322` | Sama dengan background, dipakai di elemen redup |
| `surface-container-lowest` | `#080e1d` | Elemen paling gelap (jarang dipakai) |
| `surface-container-low` | `#151b2b` | Sidebar, panel sekunder |
| `surface-container` | `#191f2f` | Container umum |
| `surface-container-high` | `#242a3a` | Tab bar background, kotak rekomendasi AI |
| `surface-container-highest` | `#2f3445` | Elemen paling menonjol dari grup surface |
| `surface-bright` | `#33394a` | Bubble chat user |
| `surface-variant` | `#2f3445` | Variasi surface (icon box, dsb) |
| `surface-glass` | `rgba(255,255,255,0.05)` | Navbar/glass overlay tipis |

> **Catatan:** ada sedikit inkonsistensi warna background antar mockup (`#0d1322` di Dashboard/Study Plan vs `#0B1120` di Document Detail). Standarkan ke **`#0d1322`** saat implementasi supaya konsisten di semua halaman.

### Warna Utama (Primary/Secondary/Tertiary)
| Token | Hex | Pemakaian |
|---|---|---|
| `primary` | `#adc6ff` | Warna aksen utama — teks aktif, border fokus, logo |
| `on-primary` | `#002e6a` | Teks di atas elemen primary solid |
| `primary-container` | `#4d8eff` | Varian primary lebih pekat |
| `secondary` | `#4cd7f6` | Cyan — dipakai untuk source badge, icon AI |
| `secondary-container` | `#03b5d3` | Varian secondary lebih pekat |
| `tertiary` | `#d0bcff` | Ungu — aksen dekoratif (misal icon dokumen ke-3) |
| `tertiary-container` | `#a078ff` | Varian tertiary lebih pekat |

### Warna Fungsional (CTA & Glow)
| Token | Hex | Pemakaian |
|---|---|---|
| `glow-electric` | `#3B82F6` | **Warna tombol CTA utama** (Upload, Login, Start Learning prioritas 1) + efek glow |
| `glow-cyan` | `#22D3EE` | Aksen sekunder glow (icon AI, progress bar) |

### Teks
| Token | Hex | Pemakaian |
|---|---|---|
| `on-surface` / `on-background` | `#dde2f8` | Teks utama (hampir putih) |
| `on-surface-variant` | `#c2c6d6` | Teks sekunder/deskripsi |
| `text-muted` | `#94A3B8` | Teks paling redup (meta info, timestamp) |
| `outline` | `#8c909f` | Border/garis penting |
| `outline-variant` | `#424754` | Border tipis/divider |

### Status/Semantic (dipakai langsung sebagai warna Tailwind bawaan, bukan token custom)
| Warna | Pemakaian |
|---|---|
| `error` (`#ffb4ab`) / `red` | Prioritas 1 study plan (paling lemah), warning |
| `yellow-500` | Prioritas 2 study plan (menengah) |
| `green-500` | Prioritas 3 study plan (sudah kuat), status sukses |

---

## 3. Tipografi

| Style Name | Font | Size/Line-height | Weight | Pemakaian |
|---|---|---|---|---|
| `display-lg` | Manrope | 48px/56px, letter-spacing -0.02em | 800 | Brand logo besar |
| `headline-lg` | Manrope | 32px/40px | 700 | Judul halaman (desktop) |
| `headline-lg-mobile` | Manrope | 24px/32px | 700 | Judul halaman (mobile) |
| `headline-md` | Manrope | 24px/32px | 600 | Judul card/section |
| `body-lg` | Hanken Grotesk | 18px/28px | 400 | Body besar (jarang dipakai) |
| `body-md` | Hanken Grotesk | 16px/24px | 400 | Body text default |
| `label-md` | Hanken Grotesk | 14px/20px, letter-spacing 0.05em | 600 | Label tombol, nav link |
| `label-sm` | Hanken Grotesk | 12px/16px | 500 | Meta text, badge kecil |

**Import font:**
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

---

## 4. Spacing & Border Radius

| Token | Nilai |
|---|---|
| `container-max-width` | 1280px |
| `margin-desktop` | 64px |
| `margin-mobile` | 20px |
| `gutter` | 24px |
| `unit` | 8px (basis spacing) |

| Radius | Nilai | Pemakaian |
|---|---|---|
| default | 0.25rem | Elemen kecil |
| `lg` | 0.5rem | Input, button kecil |
| `xl` | 0.75rem | Button besar |
| `2xl` (Tailwind default) | 1rem | **Card utama** (paling sering dipakai) |
| `full` | 9999px | Badge pill, avatar, FAB button |

---

## 5. Efek Visual Signature: "Glass + Glow"

Ini adalah ciri khas visual yang dipakai konsisten di semua halaman — implementasikan sebagai utility class/komponen reusable di awal.

### Glass Card/Panel
```css
.glass-card, .glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* highlight halus di atas */
}
.glass-card:hover {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```
Dipakai untuk: semua card (dokumen, chat panel, study plan item, login form, sidebar widget).

### Glow Button
```css
.glow-btn, .glow-button, .btn-primary {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}
.btn-primary:hover {
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
  transform: translateY(-1px);
}
```
Dipakai untuk: tombol CTA utama (Upload, Login, Daftar, Start Learning prioritas tertinggi, Send chat, FAB chatbot).

### Background Halaman
- Base: warna solid `#0d1322`
- Opsional (dipakai di Document Detail): radial gradient glow halus di atas tengah:
  ```css
  background-image: radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.15), transparent 60%);
  background-attachment: fixed;
  ```

### Custom Scrollbar (untuk area chat yang scrollable)
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
```

---

## 6. Komponen Reusable

### 6.1 Top Navbar (fixed, semua halaman protected)
- Fixed top, height 80px (`h-20`), lebar penuh, isi dibatasi `max-w-container-max-width` + center
- Background: `surface-glass` + `backdrop-blur-xl` + border-bottom putih transparan tipis
- Kiri: logo "StudyAI" + nav link (Dashboard, Study Plan) — link aktif: warna `primary` + bold + border-bottom 2px
- Kanan: search bar (pill, background `surface-container-highest`), icon notifikasi, icon settings, tombol Logout, avatar bulat

### 6.2 Document Card (Dashboard)
- `glass-card rounded-2xl p-6 h-64`, flex column justify-between
- Header: icon box kiri (background `surface-container`, icon warna beda per tipe file) + status badge kanan
  - Status **Processed**: pill `primary/20` bg, teks `primary`, dot kecil pulsing
  - Status **Processing**: pill `surface-container-high`, icon `sync` berputar (`animate-spin`)
  - *(Tambahan yang perlu ditambahkan sendiri: status **Failed** — sarankan pill merah/`error` dengan icon `error` atau `warning`, belum ada di mockup)*
- Footer: judul dokumen (`headline-md`, line-clamp-2), meta row (waktu upload + tipe file) pakai `label-sm` + `text-muted`

### 6.3 Upload Card (Empty/Add State)
- Border dashed, rounded-2xl, tinggi sama dengan document card
- Icon `+` dalam lingkaran di tengah + teks "Drag & Drop or Click to Upload"
- Hover: border jadi `primary/50`, background jadi `surface-glass`

### 6.4 Study Plan Item

**Versi ringkas (sidebar Dashboard):**
- `surface-container-high rounded-xl p-4`
- Badge kecil uppercase (PRIORITY/SUGGESTED) warna sesuai urgensi
- Judul (`label-md`) + deskripsi 2 baris (`line-clamp-2`)
- Progress bar tipis opsional (untuk topik prioritas tertinggi)

**Versi lengkap (halaman Study Plan):**
- `glass-panel rounded-2xl p-6`, dengan **bar aksen kiri 4px** berwarna sesuai prioritas (merah/kuning/hijau)
- Badge prioritas uppercase + judul topik (`headline-md`)
- Deskripsi singkat kondisi
- Progress bar "Mastery Level" dengan persentase, warna sesuai prioritas
- Box "AI Recommendation" (background `surface-container-low`, icon `psychology`, teks rekomendasi)
- Tombol "Start Learning" — solid glow untuk prioritas 1, outline untuk prioritas lain

### 6.5 Chat Interface (Tab Chat, Document Detail)
- Container: `glass-panel rounded-2xl`, flex column, scrollable message area
- **Bubble AI:** avatar bulat kiri (`primary/20` bg + icon `smart_toy`), bubble `glass-panel` dengan border kiri aksen `primary` 2px, `rounded-tl-sm`
- **Bubble User:** avatar kanan (foto/inisial), bubble `surface-bright`, `rounded-tr-sm`, rata kanan
- **Source badge** (di bawah jawaban AI): pill kecil `secondary-container/20`, icon `find_in_page`, teks uppercase "Source: [nama dokumen], [bagian]"
- **Loading state:** avatar AI dengan opacity rendah + icon `more_horiz` animasi pulse
- **Input area:** bar bawah, tombol attach (opsional, bisa di-skip untuk MVP karena upload sudah lewat Dashboard), input pill rounded-xl, tombol send bulat `primary` + glow
- Disclaimer kecil di bawah input: "AI can make mistakes. Always verify facts from the source document." → **penting untuk konteks Indonesia, ganti jadi Bahasa Indonesia**, misal: "AI bisa saja keliru. Selalu verifikasi ke dokumen sumber."

### 6.6 Tab Switcher (Chat Q&A / Generate Quiz)
- Container pill `surface-container-high p-1 rounded-xl`
- Tab aktif: `primary/20` bg, teks `primary` bold
- Tab non-aktif: teks `on-surface-variant`, hover `bg-white/5`

### 6.7 Form Login/Register
- Card tunggal `glass-card`, max-width medium, center layar
- Background dekoratif: gambar dengan opacity rendah di belakang seluruh halaman (opsional — bisa diganti radial gradient polos kalau tidak mau pakai gambar generated)
- Input: `input-glass` — background hitam transparan, border putih tipis, fokus jadi border `glow-electric` + glow halus
- Icon di dalam input (kiri): `person` untuk username, `mail` untuk email, `lock` untuk password
- Tombol submit: `btn-primary` (isi warna, glow, ada icon panah/tambah user)
- Switch Login↔Register: di mockup pakai toggle JS (tanpa reload). **Untuk React dengan routing sendiri, ini sebaiknya jadi 2 route terpisah** (`/login`, `/register`) sesuai desain di `Frontend-Design.md`, bukan toggle panel — supaya URL bisa langsung diakses/dibagikan

### 6.8 Floating Chatbot Widget
- Posisi: fixed bottom-left
- Varian compact (Dashboard/Document Detail): card kecil dengan avatar + teks singkat "Ask AI about your materials"
- Varian FAB (Study Plan): tombol bulat gradient dengan glow kuat, muncul tooltip chat bubble yang auto-dismiss setelah beberapa detik
- **Catatan:** widget ini TIDAK ada endpoint backend-nya di scope saat ini — backend chat yang sudah dibangun scoped ke satu `document_id` tertentu (dari halaman Document Detail), bukan floating widget global. Kalau mau dipertahankan sebagai fitur, perlu didiskusikan dulu apakah jadi shortcut ke halaman Document Detail terakhir, atau fitur baru di luar scope MVP. **Rekomendasi: skip dulu widget ini di MVP**, fokus ke Tab Chat yang sudah ada endpoint-nya.

---

## 7. Layout per Halaman

| Halaman | Struktur |
|---|---|
| Login/Register | Single centered card, tanpa navbar/sidebar |
| Dashboard | Navbar atas + main content 2 kolom (grid dokumen 2/3 lebar + sidebar study plan 1/3 lebar) |
| Document Detail | Navbar atas + 2 kolom (info dokumen 1/4 lebar, hidden di mobile + area interaktif Chat/Quiz 3/4 lebar) |
| Study Plan | Navbar atas + sidebar kiri fixed (w-64, desktop only) + main content 2 kolom (list topik 2/3 + widget overview & upcoming 1/3) |

**Catatan:** Dashboard pakai navbar horizontal biasa, sedangkan Study Plan di mockup punya **sidebar vertikal tambahan** (dengan menu Home/Documents/Quiz History/Analytics) yang tidak ada di Dashboard. Ini kemungkinan inkonsistensi antar mockup (dua pendekatan navigasi berbeda). **Perlu diputuskan salah satu:**
- Opsi A: pakai navbar horizontal saja di semua halaman (lebih konsisten dengan Dashboard & Document Detail)
- Opsi B: pakai sidebar vertikal di semua halaman (lebih scalable kalau nanti nambah menu)

Rekomendasi saya: **Opsi A (navbar horizontal saja)** untuk MVP, karena scope halaman masih sedikit (4 halaman) dan sidebar dengan menu "Quiz History"/"Analytics"/"Upgrade to Pro" itu fitur yang belum ada di backend (di luar scope MVP kita).

---

## 8. Yang Perlu Disesuaikan dari Mockup ke Kondisi Real Backend

Mockup ini generic/aspirational (dibuat AI generator desain), beberapa hal perlu disesuaikan ke backend yang sebenarnya sudah dibangun:

1. **Status badge dokumen** — mockup cuma ada "Processed"/"Processing", backend punya 3 status: `processed`, `pending`, `failed`. Perlu tambah 1 varian badge untuk `failed` (belum ada di mockup).
2. **Sidebar menu di Study Plan** (Home, Documents, Quiz History, Analytics, Upgrade to Pro) — sebagian besar ini fitur yang **belum ada endpoint-nya** di backend (Quiz History terpisah, Analytics, Upgrade to Pro). Untuk MVP, sederhanakan ke menu yang benar-benar ada: Dashboard, Study Plan saja (skip yang lain atau nonaktifkan dulu).
3. **Search bar di navbar** — belum ada endpoint search di backend. Skip dulu untuk MVP, atau sembunyikan.
4. **Notification icon** — belum ada sistem notifikasi di backend. Skip dulu untuk MVP.
5. **Floating chatbot widget global** — seperti disebut di 6.8, belum match dengan struktur backend (chat scoped per dokumen). Skip dulu.
6. **"Upcoming" widget (deadline/exam)** di Study Plan — data ini tidak ada di backend (tidak ada tabel deadline/exam). Skip dulu untuk MVP, atau jadi fitur manual input terpisah nanti.
7. **Warna background sedikit beda** antar mockup (`#0d1322` vs `#0B1120`) — standarkan ke satu nilai.
8. **Bahasa** — mockup campur Inggris (Dashboard, Document Detail, Study Plan) dan Indonesia (Login/Register). Karena target user mahasiswa Indonesia, **sebaiknya semua teks di-translate ke Bahasa Indonesia** untuk konsistensi.

---

## 9. Rekomendasi Setup Styling di React

Karena mockup dibuat pakai Tailwind CDN dengan config custom (`tailwind.config` inline), untuk project React sebenarnya:

1. Install Tailwind CSS secara proper (bukan CDN) via PostCSS di project Vite
2. Pindahkan seluruh `colors`, `borderRadius`, `spacing`, `fontFamily`, `fontSize` dari `tailwind-config` script di mockup ke `tailwind.config.js` project React
3. Buat file `index.css` global untuk class custom yang tidak bisa murni dari Tailwind utility (`.glass-card`, `.glow-btn`, custom scrollbar)
4. Import Google Fonts (Hanken Grotesk, Manrope, Material Symbols Outlined) di `index.html`
