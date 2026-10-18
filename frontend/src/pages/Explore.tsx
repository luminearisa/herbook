import { useEffect, useState } from 'react';
import { api } from '../api';
import { pick, useLang } from '../lang';
import { ContinueButton, ProgressBadge, Riwayat } from '../Progress';
import { Scene } from '../scene/Scene';
import type { LessonSummary } from '../types';

const SOON = [
  { icon: '🐾', name: 'Hewan · Part 2', hint: 'Suara dan makanan hewan' },
  { icon: '🌱', name: 'Tumbuhan · Part 2', hint: 'Bunga, buah, dan biji' },
  { icon: '🏠', name: 'Rumah · Part 2', hint: 'Tetangga dan lingkungan' },
];

export function Explore() {
  const [lessons, setLessons] = useState<LessonSummary[] | null>(null);
  const [error, setError] = useState('');
  useLang(); // ikut berubah saat bahasa diganti
  const titleOf = (l: LessonSummary) => pick(l.title, l.title_en);
  const titles = Object.fromEntries((lessons ?? []).map((l) => [l.slug, titleOf(l)]));
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
                <div className="cover-title">{titleOf(l)}</div>
              </div>
              <div className="book-meta">
                <h3>{titleOf(l)}</h3>
                <p>{pick(l.summary, l.summary_en)}</p>
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
