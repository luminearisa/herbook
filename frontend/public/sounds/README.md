# Suara (opsional)

Secara bawaan semua suara dibuat langsung oleh browser (Web Audio), jadi tidak ada berkas di sini.

Kalau ingin memakai rekaman asli, taruh berkasnya di folder ini (mp3/ogg, ukuran kecil) lalu daftarkan di `manifest.json`:

```json
{ "squeak": "kancil.mp3", "roar": "singa.ogg", "trumpet": "gajah.mp3" }
```

Nama suara yang tersedia: squeak, roar, growl, trumpet, tweet, cricket, tick, rustle, rain, chime,
knock, thump, splash, boing, clink, tinkle, fanfare, creak, plop, pop.

Pastikan lisensinya mengizinkan (mis. CC0 atau domain publik) sebelum dipakai.
