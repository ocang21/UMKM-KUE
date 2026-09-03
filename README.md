# 🧁 Toko Kue UMKM — Artisan Bakery & Pre-Order System

Website fullstack untuk toko kue UMKM bergaya **Warm Artisan Bakery** yang dibangun dengan **Next.js 14 (App Router)**, **PostgreSQL**, dan **Prisma ORM**. Dilengkapi katalog menu dinamis, sistem pre-order H-1, verifikasi bukti pembayaran, notifikasi WhatsApp, CMS konten, serta asisten AI pintar (*Chef Pastry AI*) berbasis Google Gemini.

---

## ✨ Fitur Utama

### 👩‍🍳 Untuk Penjual (Dashboard Admin)
- 🔐 Autentikasi aman (login/register) dengan NextAuth.js + bcrypt
- 🍰 CRUD menu kue lengkap (tambah, edit, hapus, status ready/habis, upload foto)
- 💳 Manajemen rekening bank pembayaran
- 📦 Kelola pesanan masuk (ubah status: menunggu → diproses → selesai)
- 🧾 Lihat & perbesar foto bukti transfer pelanggan
- 💬 Tombol instan chat WhatsApp ke pembeli
- 📝 CMS pengelola konten — ubah seluruh teks website tanpa coding
- 📊 Statistik ringkasan bisnis (total menu, pesanan, pendapatan)
- 📱 Mobile Bottom Navigation Bar khusus operasional lewat HP

### 🛍️ Untuk Pelanggan (Halaman Publik)
- 🏠 Landing page elegan dengan animasi floating pastry & counter statistik dinamis
- 📖 Halaman terpisah: Tentang Kami, Menu Spesial, Keunggulan, Kontak
- 🛒 Formulir pemesanan multi-item dengan keranjang interaktif
- 📸 Upload bukti pembayaran transfer bank
- 📅 Pemilihan tanggal & jam pengambilan (sistem pre-order minimal H+1)
- 📲 Notifikasi pesanan otomatis terformat ke WhatsApp penjual
- 🤖 **Chef Pastry AI** — chatbot pintar yang tahu seluruh menu, harga, rekening, dan halaman yang sedang dibuka pengguna
- 📱 Tampilan responsif penuh: minimalis di HP, megah di laptop

---

## 🛠️ Tech Stack

| Layer | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | SSR + Client Components + API Route Handlers dalam satu monorepo |
| **Bahasa** | TypeScript | Type-safety di frontend dan backend |
| **Styling** | Tailwind CSS | Custom theme Warm Artisan Bakery + animasi CSS murni |
| **Database** | PostgreSQL (Neon Serverless) | Cloud database dengan connection pooling & SSL |
| **ORM** | Prisma | Query type-safe, skema terpusat, migrasi mudah |
| **Auth** | NextAuth.js v4 | Credentials Provider + JWT Session + bcryptjs |
| **AI** | Google Gemini API | Chatbot dengan grounding data real-time dari database |
| **Notifikasi** | WhatsApp URL Scheme | Pesan pesanan terformat otomatis tanpa biaya gateway |
| **UI Feedback** | React Hot Toast | Notifikasi interaktif |

---

## 🏗️ Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Client)                    │
│  Halaman Publik          │  Dashboard Admin (Protected)  │
│  • Beranda (/)           │  • Ringkasan (/dashboard)     │
│  • Menu (/menu)          │  • Menu Kue (/dashboard/cakes)│
│  • Order (/order)        │  • Pesanan (/dashboard/orders)│
│  • Tentang (/tentang)    │  • Rekening (/dashboard/...)  │
│  • Keunggulan, Kontak    │  • CMS Konten (/dashboard/...)│
│  • AI Chat Bubble 🤖     │                               │
└──────────────┬──────────────────────────┬───────────────┘
               │ fetch / FormData         │ fetch + session
┌──────────────▼──────────────────────────▼───────────────┐
│              BACKEND (Next.js API Routes)                │
│  /api/cakes • /api/orders • /api/payment-accounts        │
│  /api/settings • /api/auth/[...nextauth] • /api/ai-chat  │
└──────────────┬──────────────────────────┬───────────────┘
               │ Prisma Client            │ REST
┌──────────────▼──────────────┐  ┌────────▼───────────────┐
│   PostgreSQL (Neon Cloud)   │  │  Google Gemini API     │
│   User • Cake • Order       │  │  (Chef Pastry AI)      │
│   OrderItem • PaymentAccount│  │                        │
└─────────────────────────────┘  └────────────────────────┘
```

---

## 🎨 FRONTEND — Penjelasan Lengkap

Seluruh halaman frontend berada di folder `app/` menggunakan pola **App Router**. Komponen interaktif ditandai `'use client'`.

### Halaman Publik

| File | Route | Deskripsi |
| :--- | :--- | :--- |
| `app/page.tsx` | `/` | Landing page: hero centerpiece dengan latar foto bakery + 4 kartu pastry melayang (animasi CSS multi-axis), pita statistik dengan **count-up animation** (`requestAnimationFrame`) yang jumlah varian kuenya **sinkron otomatis dengan database**, 6 menu teratas, cerita toko, keunggulan, CTA, dan footer responsif |
| `app/menu/page.tsx` | `/menu` | Katalog seluruh kue — grid 2 kolom di HP, 4 kolom di desktop, badge Ready/Habis |
| `app/order/page.tsx` | `/order` | Formulir pre-order: keranjang multi-item, data pemesan, tanggal ambil (min H+1), info rekening resmi, upload bukti transfer dengan preview, modal sukses + tombol kirim notifikasi WhatsApp ke penjual |
| `app/tentang/page.tsx` | `/tentang` | Cerita toko, kutipan filosofi, 3 pilar kualitas |
| `app/keunggulan/page.tsx` | `/keunggulan` | 3 keunggulan layanan + kartu sertifikasi Halal & Higienis |
| `app/kontak/page.tsx` | `/kontak` | Info WhatsApp, email, alamat, jam operasional |
| `app/login` & `app/register` | `/login`, `/register` | Autentikasi penjual |

### Halaman Dashboard (Protected)

| File | Route | Deskripsi |
| :--- | :--- | :--- |
| `app/dashboard/layout.tsx` | — | **Session guard server-side**: `getServerSession()` — redirect ke `/login` jika belum login |
| `app/dashboard/page.tsx` | `/dashboard` | Statistik: total menu, total pesanan, pesanan pending, total pendapatan (dihitung dari pesanan selesai) |
| `app/dashboard/cakes/page.tsx` | `/dashboard/cakes` | Grid CRUD menu kue + modal `CakeForm` |
| `app/dashboard/orders/page.tsx` | `/dashboard/orders` | Daftar pesanan, ubah status, preview bukti bayar fullscreen, tombol WA pembeli |
| `app/dashboard/payment/page.tsx` | `/dashboard/payment` | CRUD rekening bank + modal `PaymentAccountForm` |
| `app/dashboard/content/page.tsx` | `/dashboard/content` | CMS editor: ubah semua teks website per-tab (Info Toko, Hero, Tentang, Keunggulan) |

### Komponen Penting

| Komponen | Fungsi |
| :--- | :--- |
| `components/AIChatBubble.tsx` | Widget chat AI mengambang di seluruh halaman publik — quick prompts, riwayat multi-turn, deteksi halaman aktif (`usePathname`), render markdown |
| `components/dashboard/DashboardNav.tsx` | Navbar admin desktop + **bottom navigation bar mobile** (5 ikon thumb-friendly) |
| `components/SharedImage.tsx` | Render gambar dengan fallback cerdas (URL lokal, remote, atau Base64) |
| `components/SessionProvider.tsx` | Wrapper konteks NextAuth di sisi klien |

### Strategi Responsive (Mobile-First)
- **Breakpoint Tailwind**: kelas dasar untuk HP, prefix `sm:`/`md:`/`lg:` untuk layar lebih besar
- HP: grid 2 kolom, kartu horizontal kompak, filter swipe, tombol besar ramah jempol, safe-area padding
- Desktop: grid 3–4 kolom, floating animation cards, layout megah

---

## ⚙️ BACKEND — Penjelasan Lengkap

Seluruh backend berada di `app/api/` sebagai **Route Handlers** Next.js (server-only).

### Daftar Endpoint API

| Endpoint | Method | Akses | Fungsi |
| :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | GET/POST | Publik | Login — verifikasi email + password bcrypt, terbitkan sesi JWT |
| `/api/auth/register` | POST | Publik | Registrasi admin baru (hash password 10 salt rounds) |
| `/api/cakes/available` | GET | Publik | Daftar kue dengan `isAvailable: true` untuk etalase |
| `/api/cakes` | GET/POST | 🔒 Admin | Ambil semua kue milik admin / tambah kue baru (FormData + foto) |
| `/api/cakes/[id]` | GET/PUT/DELETE | 🔒 Admin | Detail, edit, hapus kue (+ hapus file foto lama) |
| `/api/orders` | POST | Publik | Buat pesanan: validasi `cakeId` terhadap DB, simpan bukti bayar, buat `Order` + `OrderItem` atomik |
| `/api/orders` | GET | 🔒 Admin | Semua pesanan terurut terbaru dengan relasi item |
| `/api/orders/[id]/status` | PATCH | 🔒 Admin | Ubah status (`menunggu`/`diproses`/`selesai`) |
| `/api/payment-accounts/public` | GET | Publik | 1 rekening aktif untuk halaman checkout |
| `/api/payment-accounts` | GET/POST | 🔒 Admin | Kelola daftar rekening |
| `/api/payment-accounts/[id]` | PUT/DELETE | 🔒 Admin | Edit/hapus rekening (dengan cek kepemilikan) |
| `/api/settings` | GET | Publik | Baca konten CMS website |
| `/api/settings` | PUT | 🔒 Admin | Simpan perubahan konten CMS |
| `/api/ai-chat` | POST | Publik | Chatbot AI — grounding data kue & rekening real-time dari DB, context halaman aktif, riwayat multi-turn |

### Lapisan Keamanan Backend
1. **Session Guard** — endpoint privat memverifikasi `getServerSession(authOptions)`; tanpa sesi valid → `401 Unauthorized`
2. **Ownership Guard** — edit/hapus memeriksa `userId` data = `session.user.id`; jika bukan pemilik → `403 Forbidden`
3. **Input Validation** — validasi field wajib (`400 Bad Request`), parse JSON aman dengan try-catch, sanitasi angka/string
4. **FK Constraint Protection** — `cakeId` pada order diverifikasi ke database dulu; ID tak valid diisi `null` (relasi `SetNull`) sehingga histori pesanan tetap aman
5. **Password Hashing** — bcryptjs, tidak pernah menyimpan password plaintext
6. **Upload Safety** — nama file acak (`timestamp + crypto.randomBytes`), deteksi MIME type, fallback Base64 bila filesystem tak bisa ditulis

### Library Pendukung (`lib/`)

| File | Fungsi |
| :--- | :--- |
| `lib/prisma.ts` | Singleton Prisma Client (mencegah koneksi berlebih saat hot-reload) |
| `lib/auth.ts` | Konfigurasi NextAuth: CredentialsProvider, callback JWT & session |
| `lib/uploads.ts` | `saveUpload()` — simpan file upload; `saveDataUrl()` — konversi Base64 ke file; `deleteUpload()` — hapus file lama |
| `lib/settings-server.ts` | Baca/tulis `public/site-settings.json` untuk CMS (server-only, pakai `fs/promises`) |
| `lib/settings.ts` | Interface `SiteSettings` + nilai default (aman diimpor client) |
| `lib/sampleCakes.ts` | 20 data katalog kue fallback saat DB kosong |

---

## 🗄️ Skema Database (Prisma)

```
User ─── 1:N ──▶ Cake ◀── N:1 (nullable) ─── OrderItem ─── N:1 ──▶ Order
  └── 1:N ──▶ PaymentAccount
```

| Model | Field Kunci | Catatan |
| :--- | :--- | :--- |
| **User** | `email` (unik), `password` (hash), `role` | Akun penjual |
| **Cake** | `name`, `price`, `imageUrl`, `isAvailable` | `onDelete: Cascade` dari User |
| **PaymentAccount** | `bankName`, `accountNumber`, `accountName` | Milik User |
| **Order** | `customerName`, `whatsappNumber`, `pickupDate`, `pickupTime`, `paymentProofUrl`, `status` | Status: `menunggu` → `diproses` → `selesai` |
| **OrderItem** | `quantity`, `cakeName`, `cakePrice` (snapshot), `cakeId` (nullable) | **Snapshot harga & nama** — histori transaksi tetap valid meski kue dihapus/diubah (`onDelete: SetNull`) |

---

## 🤖 Alur Kerja Chef Pastry AI

1. Pengguna mengetik pertanyaan di `AIChatBubble` (kirim: pesan + `currentPath` + riwayat chat)
2. Backend `/api/ai-chat` membaca **data real-time** dari database: seluruh kue aktif (nama, harga) + rekening resmi
3. Data disuntikkan ke *system prompt* Gemini dengan aturan ketat: *hanya rekomendasikan kue yang benar-benar ada beserta harga persisnya* (anti-halusinasi / grounding)
4. AI menerima konteks halaman aktif — di `/order` ia memandu pengisian formulir, di `/menu` ia membantu memilih kue
5. Respons dirender dengan format markdown rapi di bubble chat

---

## 🚀 Setup & Instalasi

### 1. Clone & Install
```bash
git clone https://github.com/ocang21/UMKM-KUE.git
cd UMKM-KUE
npm install
```

### 2. Konfigurasi Environment
Buat file `.env` di root project, lalu isi seluruh kredensial Anda sendiri (koneksi database PostgreSQL, konfigurasi NextAuth, dan API key AI).

> ⚠️ **Penting**: File `.env` berisi kredensial rahasia — **jangan pernah** di-commit ke repository atau dibagikan secara publik. File ini sudah terdaftar di `.gitignore`.

### 3. Setup Database
```bash
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Sinkronkan skema ke database
npx tsx prisma/seed.ts              # (Opsional) Buat akun admin demo
npx tsx prisma/seed-traditional.ts  # (Opsional) Isi 20 menu kue contoh
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000).

### 5. Build Production
```bash
npm run build
npm start
```

---

## 📖 Panduan Penggunaan

### Alur Penjual
1. Login melalui `/login` (atau registrasi di `/register`)
2. Tambah menu kue di **Dashboard → Menu Kue** (foto, nama, harga, status ready)
3. Atur rekening bank di **Dashboard → Rekening**
4. Sesuaikan teks website di **Dashboard → Kelola Konten**
5. Pantau pesanan masuk di **Dashboard → Pesanan**: cek bukti transfer → ubah status → hubungi pembeli via tombol WhatsApp

### Alur Pelanggan
1. Jelajahi menu di beranda atau `/menu` (bisa bertanya dulu ke **Chef Pastry AI** 🤖)
2. Klik **Pesan Sekarang** → keranjang otomatis terisi
3. Isi nama, nomor WhatsApp, tanggal & jam ambil (minimal besok / H+1)
4. Transfer ke rekening resmi yang tertera → upload bukti transfer
5. Klik **Konfirmasi & Kirim Pesanan** → notifikasi WhatsApp terformat otomatis terbuka untuk dikirim ke penjual

---

## ☁️ Deploy ke Production (Vercel)

1. Push kode ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Atur seluruh **Environment Variables** melalui **Vercel Dashboard → Settings → Environment Variables** (jangan hardcode di kode!)
4. Deploy 🚀

> Database PostgreSQL serverless (mis. Neon) sudah mendukung production dengan connection pooling & SSL aktif.

---

## 🧯 Troubleshooting

| Masalah | Solusi |
| :--- | :--- |
| `Prisma Client tidak ditemukan` | Jalankan `npx prisma generate` |
| `Database connection failed` | Periksa koneksi database di environment variables, koneksi internet, dan status server DB |
| `Module not found './xxx.js'` saat dev | Hapus cache: `Remove-Item -Recurse -Force .next` lalu jalankan ulang `npm run dev` |
| Upload gambar gagal | Pastikan ukuran file wajar (< 5MB) dan folder `public/uploads/` dapat ditulis; sistem punya fallback Base64 otomatis |
| Angka statistik `0` terus | Pastikan API `/api/cakes/available` mengembalikan data (cek koneksi database) |

---

## 🔐 Keamanan

- Password admin di-hash dengan **bcrypt** (tidak pernah plaintext)
- Sesi login menggunakan **JWT** terenkripsi via NextAuth
- Koneksi database wajib **SSL**
- Kredensial rahasia hanya hidup di **environment variables** — tidak pernah di-hardcode maupun di-commit
- Endpoint admin dilindungi **session guard** + **ownership check**
- Validasi & sanitasi input di seluruh endpoint publik

## License

MIT
