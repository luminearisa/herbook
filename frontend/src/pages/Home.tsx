import { useEffect, useState } from 'react';
import { api } from '../api';
import { pick, useLang } from '../lang';
import { ContinueButton, ProgressBadge, Riwayat } from '../Progress';
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
  const [tab, setTab] = useState<'semua' | 'dongeng' | 'fabel' | 'adab' | 'islami'>('semua');
  useLang(); // ikut berubah saat bahasa diganti
  const shown = books?.filter((b) => tab === 'semua' || b.category === tab);
  const titleOf = (b: BookSummary) => pick(b.title, b.title_en);
  const titles = Object.fromEntries((books ?? []).map((b) => [b.slug, titleOf(b)]));

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
            <ContinueButton kind="book" label="Lanjutkan membaca" />
            {books?.[0] && (
              <a className="btn primary" href={`#/buku/${books[0].slug}`}>Mulai membaca</a>
            )}
            <a className="btn" href="#/baru">Buat cerita dari prompt</a>
            <a className="btn" href="#/sekitar">🌿 Mengenal Sekitar</a>
          </div>
        </div>
        {books?.[0] && <Scene scene={books[0].cover} className="hero-art" />}
      </section>

      <section className="section">
        <h2>Rak buku</h2>
        <div className="tabs" role="tablist">
          {([['semua', 'Semua'], ['dongeng', 'Dongeng Kancil'], ['fabel', 'Fabel'], ['adab', 'Adab Anak Muslim'], ['islami', 'Kisah Islami']] as const).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={'tab' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        {!books && !error && <p className="muted">Memuat buku…</p>}
        <div className="shelf">
          {shown?.map((b) => (
            <a key={b.slug} href={`#/buku/${b.slug}`} className="book-card">
              <div className="cover">
                <Scene scene={b.cover} />
                <ProgressBadge kind="book" slug={b.slug} />
                <div className="cover-title">{titleOf(b)}</div>
              </div>
              <div className="book-meta">
                <h3>{titleOf(b)}</h3>
                <p>{pick(b.summary, b.summary_en)}</p>
                <span className={'chip' + (b.category === 'dongeng' ? '' : ' ' + b.category)}>
                  {b.category === 'islami' ? 'Kisah Islami · ' : b.category === 'fabel' ? 'Fabel · ' : b.category === 'adab' ? 'Adab · ' : ''}{b.page_count} halaman{b.is_seed ? '' : ' · buatanmu'}
                </span>
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

      <Riwayat titles={titles} />

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
