import { useEffect, useState } from 'react';
import { api } from '../api';
import { Scene } from '../scene/Scene';
import type { BookSummary } from '../types';

const SOON = [
  { icon: '🎧', name: 'Dongeng Suara', hint: 'Cerita dibacakan' },
  { icon: '🎨', name: 'Mewarnai', hint: 'Warnai gambar sendiri' },
  { icon: '🧩', name: 'Kuis Cerita', hint: 'Seberapa ingat kamu?' },
  { icon: '🌙', name: 'Pengantar Tidur', hint: 'Cerita lembut malam hari' },
];

export function Home() {
  const [books, setBooks] = useState<BookSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.books().then(setBooks).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Perpustakaan cerita bergambar</p>
          <h1>Selamat datang di <em>Her Book</em></h1>
          <p>
            Dongeng nusantara dengan ilustrasi yang bergerak, bisa dibacakan, dan bisa kamu tambah
            sendiri hanya dengan menulis ide ceritanya.
          </p>
          <div className="hero-actions">
            {books?.[0] && (
              <a className="btn primary" href={`#/buku/${books[0].slug}`}>Mulai membaca</a>
            )}
            <a className="btn" href="#/baru">Buat cerita dari prompt</a>
          </div>
        </div>
        {books?.[0] && <Scene scene={books[0].cover} className="hero-art" />}
      </section>

      <section className="section">
        <h2>Rak buku</h2>
        {error && <p className="error">{error}</p>}
        {!books && !error && <p className="muted">Memuat buku…</p>}
        <div className="shelf">
          {books?.map((b) => (
            <a key={b.slug} href={`#/buku/${b.slug}`} className="book-card">
              <div className="cover">
                <Scene scene={b.cover} />
                <div className="cover-title">{b.title}</div>
              </div>
              <div className="book-meta">
                <h3>{b.title}</h3>
                <p>{b.summary}</p>
                <span className="chip">{b.page_count} halaman{b.is_seed ? '' : ' · buatanmu'}</span>
              </div>
            </a>
          ))}
          <a href="#/baru" className="book-card add">
            <div className="add-inner">
              <span className="plus">+</span>
              <strong>Tambah buku</strong>
              <small>Tulis ide, jadilah cerita bergambar</small>
            </div>
          </a>
        </div>
      </section>

      <section className="section">
        <h2>Segera hadir</h2>
        <div className="soon">
          {SOON.map((s) => (
            <div key={s.name} className="soon-card" aria-disabled>
              <span className="soon-icon">{s.icon}</span>
              <strong>{s.name}</strong>
              <small>{s.hint}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
