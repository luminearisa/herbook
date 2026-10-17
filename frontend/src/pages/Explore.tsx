import { useEffect, useState } from 'react';
import { api } from '../api';
import { ContinueButton, ProgressBadge, Riwayat } from '../Progress';
import { Scene } from '../scene/Scene';
import type { LessonSummary } from '../types';

const SOON = [
  { icon: '⛰️', name: 'Alam · Part 2', hint: 'Darat dan air: gunung, sungai, laut' },
  { icon: '🐾', name: 'Hewan di Sekitar Kita', hint: 'Kenali suara dan rumahnya' },
  { icon: '🌱', name: 'Tumbuhan', hint: 'Dari biji sampai buah' },
  { icon: '🏠', name: 'Rumah dan Lingkungan', hint: 'Tempat kita tinggal' },
];

export function Explore() {
  const [lessons, setLessons] = useState<LessonSummary[] | null>(null);
  const [error, setError] = useState('');
  const titles = Object.fromEntries((lessons ?? []).map((l) => [l.slug, l.title]));
  useEffect(() => {
    api.lessons().then(setLessons).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Belajar sambil menyentuh gambar</p>
          <h1>Mengenal <em>Sekitar</em></h1>
          <p>
            Kenali alam di sekitar kita lewat gambar yang bisa disentuh. Setiap benda menyebutkan namanya,
            bergerak, dan berbunyi. Di akhir ada kuis seru untuk menguji ingatanmu.
          </p>
          {lessons?.[0] && (
            <div className="hero-actions">
              <ContinueButton kind="lesson" label="Lanjutkan belajar" />
              <a className="btn primary" href={`#/sekitar/${lessons[0].slug}`}>Mulai belajar</a>
            </div>
          )}
        </div>
        {lessons?.[0] && <Scene scene={lessons[0].cover} className="hero-art" />}
      </section>

      <section className="section">
        <h2>Materi</h2>
        {error && <p className="error">{error}</p>}
        {!lessons && !error && <p className="muted">Memuat materi…</p>}
        <div className="shelf">
          {lessons?.map((l) => (
            <a key={l.slug} href={`#/sekitar/${l.slug}`} className="book-card">
              <div className="cover">
                <Scene scene={l.cover} />
                <ProgressBadge kind="lesson" slug={l.slug} />
                <div className="cover-title">{l.title}</div>
              </div>
              <div className="book-meta">
                <h3>{l.title}</h3>
                <p>{l.summary}</p>
                <span className="chip alam">{l.page_count} pelajaran · {l.quiz_count} soal kuis</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Riwayat titles={titles} kind="lesson" />

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
