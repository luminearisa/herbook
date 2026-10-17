# Her Book

Perpustakaan buku cerita bergambar. Backend PHP + SQLite, frontend React + TypeScript.
Ilustrasi digambar sebagai **SVG** dari data adegan, jadi buku baru bisa dibuat lewat prompt.

Isi awal:
- Dongeng Kancil: *Kancil dan Buaya*, *Kancil Mencuri Timun*, *Kancil dan Gajah*
- Fabel: *Kura-kura dan Kelinci*, *Semut dan Belalang*, *Singa dan Tikus*, *Kelinci dan Singa yang Sombong*, *Kura-kura dan Dua Bangau*, *Kancil dan Mangga yang Tinggi*, *Jeruk yang Dipandang Sebelah Mata*, *Semangka yang Sombong*, *Pesta Kejutan untuk Kelinci* (tokoh buah-buahan)
- Adab Anak Muslim: *Rafi Belajar Bismillah*, *Salma dan Salam*, *Jujur Itu Indah*, *Berbagi Itu Indah* (tokoh anak: Rafi dan Salma)
- Kisah Islami: *Pasukan Gajah dan Burung Ababil* (QS. Al-Fil), *Semut yang Waspada* (QS. An-Naml), *Hud-hud dan Negeri Saba* (QS. An-Naml)

Kisah Islami sengaja tidak menggambar manusia (nabi dan sahabat); hanya hewan, alam, dan Ka'bah. Kategori Adab memakai tokoh anak Muslim fiktif beserta keluarganya.

## Menjalankan

Butuh PHP 8.1+ (ekstensi `pdo_sqlite`, `curl`) dan Node 18+.

```sh
npm start            # build frontend lalu jalankan di http://127.0.0.1:8000
```

Mode pengembangan (hot reload): `npm run dev:api` dan `npm run dev:web` di dua terminal.

## Membaca

Tombol **Layar penuh** (atau tekan `F`) membuat gambar memenuhi layar dengan teks cerita di bagian bawah. Kepekatan latar teks bisa diatur dengan slider "Teks" (tersimpan di browser). Panah kiri/kanan atau geser untuk berpindah halaman, `Esc` untuk keluar.

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

- `backend/public/index.php` – API (`GET/POST /api/books`, `GET/DELETE /api/books/{slug}`, `POST /api/books/generate`) dan penyaji frontend
- `backend/seed/*.json` – buku bawaan (otomatis dimasukkan ke SQLite di `backend/data/`)
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
