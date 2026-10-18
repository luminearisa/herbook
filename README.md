# Her Book

Perpustakaan buku cerita bergambar. Backend PHP + SQLite, frontend React + TypeScript.
Ilustrasi digambar sebagai **SVG** dari data adegan, jadi buku baru bisa dibuat lewat prompt.

Isi awal:
- Dongeng Kancil: *Kancil dan Buaya*, *Kancil Mencuri Timun*, *Kancil dan Gajah*, *Kancil dan Harimau*
- Fabel: *Kura-kura dan Kelinci*, *Semut dan Belalang*, *Singa dan Tikus*, *Kelinci dan Singa yang Sombong*, *Kura-kura dan Dua Bangau*, *Kancil dan Mangga yang Tinggi*, *Jeruk yang Dipandang Sebelah Mata*, *Semangka yang Sombong*, *Pesta Kejutan untuk Kelinci* (tokoh buah-buahan)
- Adab Anak Muslim: *Rafi Belajar Bismillah*, *Salma dan Salam*, *Jujur Itu Indah*, *Berbagi Itu Indah* (tokoh anak: Rafi dan Salma)
- Kisah Islami: *Pasukan Gajah dan Burung Ababil* (QS. Al-Fil), *Semut yang Waspada* (QS. An-Naml), *Hud-hud dan Negeri Saba* (QS. An-Naml), *Nabi Nuh dan Bahtera* (QS. Hud), *Nabi Yunus dan Ikan Paus* (QS. Al-Anbiya, Ash-Shaffat), *Ashabul Kahfi dan Anjingnya* (QS. Al-Kahfi), *Anjing yang Kehausan* (HR. Bukhari dan Muslim), *Nabi Saleh dan Unta Allah* (QS. Al-A'raf, Hud, Asy-Syu'ara), *Nabi Ibrahim dan Api* (QS. Al-An'am, Al-Anbiya; HR. Bukhari), *Nabi Musa dan Laut yang Terbelah* (QS. Asy-Syu'ara, Thaha, Yunus)

Kisah Islami sengaja tidak menggambar manusia (nabi dan sahabat); hanya hewan, alam, dan Ka'bah. Kategori Adab memakai tokoh anak Muslim fiktif beserta keluarganya.

## Menjalankan

Butuh PHP 8.1+ (ekstensi `pdo_sqlite`, `curl`) dan Node 18+.

```sh
npm start            # build frontend lalu jalankan di http://127.0.0.1:8000
```

Mode pengembangan (hot reload): `npm run dev:api` dan `npm run dev:web` di dua terminal.

## Membaca

Tombol **Layar penuh** (atau tekan `F`) membuat gambar memenuhi layar dengan teks cerita di bagian bawah. Kepekatan latar teks bisa diatur dengan slider "Teks" (tersimpan di browser). Panah kiri/kanan atau geser untuk berpindah halaman, `Esc` untuk keluar.

## Mengenal Sekitar

Segmen belajar selain cerita (`#/sekitar`). Materi yang tersedia: **Alam Part 1: Langit dan Cuaca** (matahari, bulan, bintang, awan, hujan, pelangi, angin, kilat dan guntur), **Alam Part 2: Darat dan Air** (gunung, lembah, sungai, air terjun, laut, ombak, pasir dan tanah, serta menjaga alam), **Benda Part 1: Benda-Benda di Sekitar Kita** (rumah, pagar, meja, vas, kue, sumur, tongkat, kurungan), **Cuaca Part 1: Mengenal Cuaca** (cerah, berawan, mendung, hujan, berangin, panas, dingin), **Hewan Part 1: Hewan di Sekitar Kita** (hewan peliharaan, hewan kecil, burung dan sarang, ikan, hewan hutan, hewan laut, menyayangi hewan), **Tumbuhan Part 1: Mengenal Tumbuhan** (bagian tumbuhan, dari biji menjadi tumbuhan, daun/bunga/buah, oksigen dan naungan, merawat dan menjaga), dan **Rumah Part 1: Rumah dan Lingkungan** (bagian rumah, ruang tamu, makan bersama, halaman, sumur dan air bersih, lingkungan, menjaga kebersihan). Tiap pelajaran punya gambar yang bisa disentuh (nama benda tampil dan diucapkan), penjelasan, fakta "Tahukah kamu?", dan di akhir ada kuis dengan bintang penilaian. Materi disimpan sebagai JSON di `backend/seed/lessons/` dan dilayani lewat `GET /api/lessons`.

## Bahasa: Indonesia ⇄ English

Semua **cerita bawaan** (27 buku) dan **materi Mengenal Sekitar** punya versi bahasa Inggris. Tombol
**ID · EN** di bar atas (juga tampil di halaman baca/materi) menggantinya: judul, ringkasan, isi tiap
halaman, pesan moral, penjelasan materi, fakta, refleksi, soal kuis, sampai nama benda yang diucapkan
saat gambar disentuh. Pilihan bahasa tersimpan di browser (`localStorage`). Label antarmuka (menu,
tombol) tetap berbahasa Indonesia.

Terjemahan disimpan sebagai berkas di `backend/seed/en/` (buku) dan `backend/seed/en/lessons/`
(materi), lalu dimasukkan ke kolom `en` di SQLite saat aplikasi dibuka. Menambah atau memperbaiki
terjemahan cukup dengan mengubah berkas itu — isinya akan disinkronkan ulang otomatis. Kalau sebuah
cerita belum punya terjemahan (mis. buku hasil prompt), teksnya otomatis kembali ke bahasa Indonesia.

## Akun & riwayat baca

Tanpa akun pun riwayat baca langsung tersimpan di browser (`localStorage`): daftar cerita dan materi
menampilkan lencana kemajuan (mis. `📖 3/8` atau `✓ Selesai`), ada tombol **Lanjutkan membaca** ke
posisi terakhir, dan bagian **Terakhir dibaca** di beranda serta halaman Mengenal Sekitar.

Kalau ingin riwayat ikut tersimpan di akun (bisa dibuka dari perangkat lain), buat akun lewat
`#/masuk` dengan **nama, email, username, kata sandi**, dan **nomor WA (opsional)**. Saat mendaftar
atau masuk, riwayat yang sudah ada di perangkat itu otomatis digabungkan ke akun. Sesi login memakai
cookie `HttpOnly` (aman dari JavaScript), berlaku 30 hari, dan ditutup dengan tombol **Keluar**.

**Login sepenuhnya opsional** — tanpa akun semua fitur (membaca, materi, kuis, membuat buku) tetap
bisa dipakai; yang berbeda hanya tempat menyimpan riwayat. Halaman `#/profil` (tombol 👤 di bar atas)
dipakai untuk mengubah nama, nomor WA, dan kata sandi.

## Interaktif

Di halaman baca, gambar bisa disentuh: pohon bergoyang dan menjatuhkan daun (atau buah), kancil melompat, buaya membuka mulut dan menggeram, gajah berteriak, awan meneteskan hujan, bunga berkilau, orang dan tokoh buah menyapa dengan suara, dan seterusnya. Daftar reaksi tiap jenis ada di `frontend/src/scene/interactions.ts`. Menyentuh bagian kosong juga ada efeknya: riak air di sungai, kilau di langit, dan kepulan debu di tanah. Di adegan malam, bulan bisa disentuh. Ka'bah sengaja tidak dibuat interaktif.

Suara dibuat langsung oleh browser (Web Audio), jadi tanpa berkas dan tanpa masalah lisensi. Untuk memakai rekaman asli, lihat `frontend/public/sounds/README.md`. Tombol 🔊 di bar atas mematikan semua suara.

## Tambah buku dengan prompt

Buka **+ Buku Baru**, tulis ide cerita. Dengan `ANTHROPIC_API_KEY` di environment, Claude
menulis cerita dan menyusun adegan (model bisa diganti lewat `HERBOOK_MODEL`). Tanpa key dipakai
penyusun cerita sederhana bawaan (hanya untuk dongeng; Kisah Islami butuh key agar isinya tidak dikarang dari templat).

```sh
ANTHROPIC_API_KEY=sk-... npm run dev:api
```

## Struktur

- `backend/public/index.php` – API (`GET/POST /api/books`, `GET/DELETE /api/books/{slug}`, `POST /api/books/generate`, `GET/POST /api/lessons`, `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/profile`, `POST /api/auth/password`, `GET/POST /api/progress`, `POST /api/progress/merge`) dan penyaji frontend
- `backend/src/Auth.php` – daftar/masuk/keluar pengguna, sesi cookie `HttpOnly` (tabel `users`, `sessions`)
- `backend/src/Progress.php` – riwayat baca per pengguna (tabel `progress`); tamu memakai `localStorage` di `frontend/src/progress.ts`
- `backend/seed/*.json` – buku bawaan (otomatis dimasukkan ke SQLite di `backend/data/`)
- `backend/seed/en/` – terjemahan Inggris buku & materi (kolom `en` di SQLite)
- `frontend/src/lang.ts` – pilihan bahasa (ID/EN) tersimpan di browser; `LanguageToggle.tsx` tombolnya
- `backend/src/Scene.php` – kosakata adegan yang diizinkan (latar, tokoh, properti, suasana)
- `frontend/src/scene/` – penggambar SVG: latar, tokoh (kancil, buaya, harimau, petani, …), properti

Format adegan: `{"bg":"sungai","items":[{"t":"kancil","x":100,"y":450,"s":1.2,"mood":"licik","pose":"lompat"}]}`
di kanvas 800×500. Untuk menambah tokoh/properti baru, gambar komponennya di `frontend/src/scene/`
dan daftarkan di `Scene.tsx` serta `Scene.php`.

## Deploy ke Hostinger (shared hosting)

`deploy/deploy.sh` membangun frontend lalu mengunggah lewat SSH/rsync. Susunan di server:

- `domains/<domain>/herbook-app/` : `src/`, `seed/`, `public/`, `data/` (database), `.env` (di luar folder web)
- `domains/<domain>/public_html/herbook/` : hasil build frontend, `index.php` dan `.htaccess` dari `deploy/`

```sh
bash deploy/deploy.sh                      # nilai bawaan bisa diganti: HERBOOK_HOST, HERBOOK_PORT, HERBOOK_BASE
```

Pakai kunci SSH, jangan menyimpan password di repo. Untuk fitur prompt, isi `herbook-app/.env` di server dengan `ANTHROPIC_API_KEY=...`.

## Pasang sebagai aplikasi (PWA)

Her Book adalah aplikasi web progresif: ada manifest, ikon, dan service worker (`frontend/public/`). Di Chrome/Edge/Android muncul pop-up "Pasang Her Book" dan tombol **Pasang aplikasi** di bar atas; di iPhone/iPad (Safari) muncul petunjuk "Tambah ke Layar Utama". Buku yang pernah dibuka tetap bisa dibaca tanpa internet. Pemasangan hanya berfungsi lewat HTTPS (atau `localhost`).
