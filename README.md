# Her Book

Perpustakaan buku cerita bergambar. Backend PHP + SQLite, frontend React + TypeScript.
Ilustrasi digambar sebagai **SVG** dari data adegan, jadi buku baru bisa dibuat lewat prompt.

Isi awal:
- Dongeng Kancil: *Kancil dan Buaya*, *Kancil Mencuri Timun*, *Kancil dan Gajah*
- Fabel: *Kura-kura dan Kelinci*, *Semut dan Belalang*, *Singa dan Tikus*
- Kisah Islami: *Pasukan Gajah dan Burung Ababil* (QS. Al-Fil), *Semut yang Waspada* (QS. An-Naml), *Hud-hud dan Negeri Saba* (QS. An-Naml)

Kisah Islami sengaja tidak menggambar manusia (nabi dan sahabat); hanya hewan, alam, dan Ka'bah.

## Menjalankan

Butuh PHP 8.1+ (ekstensi `pdo_sqlite`, `curl`) dan Node 18+.

```sh
npm start            # build frontend lalu jalankan di http://127.0.0.1:8000
```

Mode pengembangan (hot reload): `npm run dev:api` dan `npm run dev:web` di dua terminal.

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
