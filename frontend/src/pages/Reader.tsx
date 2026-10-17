import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { go } from '../App';
import { api } from '../api';
import { getEntry, save } from '../progress';
import { Scene } from '../scene/Scene';
import { SoundToggle } from '../SoundToggle';
import type { Book } from '../types';

export function Reader({ slug }: { slug: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const touchX = useRef<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const [full, setFull] = useState(false);
  const [touched, setTouched] = useState(false);
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth);
  const [alpha, setAlpha] = useState(() => {
    try {
      return Number(localStorage.getItem('herbook-text-alpha')) || 78;
    } catch {
      return 78;
    }
  });
  const [note] = useState(() => {
    const n = sessionStorage.getItem('herbook-note');
    sessionStorage.removeItem('herbook-note');
    return n;
  });
  const [resume, setResume] = useState(0);

  useEffect(() => {
    api.book(slug).then(setBook).catch((e: Error) => setError(e.message));
    return () => window.speechSynthesis?.cancel();
  }, [slug]);

  const total = book ? book.pages.length + 1 : 0; // + halaman penutup

  // Catat riwayat baca: sampai halaman berapa cerita ini dibaca.
  useEffect(() => {
    if (!book) return;
    save(
      'book',
      book.slug,
      book.title,
      Math.min(index + 1, book.pages.length),
      book.pages.length,
      index >= book.pages.length,
    );
  }, [book, index]);

  // Tawarkan melanjutkan bila terakhir berhenti di tengah cerita.
  useEffect(() => {
    if (!book) {
      setResume(0);
      return;
    }
    const p = getEntry('book', book.slug);
    setResume(p && !p.completed && p.page > 0 && p.page < book.pages.length ? p.page : 0);
  }, [book]);

  useEffect(() => {
    if (index !== 0) setResume(0);
  }, [index]);

  // Layar penuh: API browser bila ada, kalau tidak (mis. iPhone) cukup mode CSS.
  const enterFull = useCallback(() => {
    setFull(true);
    root.current?.requestFullscreen?.().catch(() => {});
  }, []);
  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    const onResize = () => setPortrait(window.innerHeight > window.innerWidth);
    document.addEventListener('fullscreenchange', onFs);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      window.removeEventListener('resize', onResize);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('herbook-text-alpha', String(alpha));
    } catch {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }, [alpha]);
  const move = useCallback(
    (d: number) => {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      setIndex((i) => Math.max(0, Math.min(total - 1, i + d)));
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'f' || e.key === 'F') (full ? exitFull : enterFull)();
      if (e.key === 'Escape' && full) exitFull();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, full, enterFull, exitFull]);

  if (error) return <p className="error narrow section">{error}</p>;
  if (!book) return <p className="muted narrow section">Membuka buku…</p>;

  const isEnd = index === book.pages.length;
  const page = isEnd ? null : book.pages[index];

  function toggleSpeak() {
    const synth = window.speechSynthesis;
    if (!synth || !page) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(page.text);
    u.lang = 'id-ID';
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  }

  async function remove() {
    if (!window.confirm(`Hapus buku "${book!.title}"?`)) return;
    await api.remove(book!.slug).catch((e: Error) => setError(e.message));
    go('/');
  }

  return (
    <section
      ref={root}
      className={'reader' + (full ? ' full' : '')}
      style={{ '--text-alpha': alpha / 100 } as CSSProperties}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="reader-head">
        <a href="#/" className="back">← Rak buku</a>
        <h1>{book.title}</h1>
        <span className="muted page-count">{isEnd ? 'Tamat' : `Halaman ${index + 1} dari ${book.pages.length}`}</span>
        {full && (
          <label className="alpha-ctl">
            Teks
            <input type="range" min={30} max={100} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} aria-label="Kepekatan latar teks" />
          </label>
        )}
        <SoundToggle />
        <button className="btn small" onClick={full ? exitFull : enterFull} aria-pressed={full}>
          {full ? '✕ Keluar' : '⛶ Layar penuh'}
        </button>
      </div>
      {note && <p className="note">{note}</p>}
      {resume > 0 && index === 0 && (
        <p className="note resume-note">
          📖 Terakhir kamu sampai halaman {resume}.{' '}
          <button
            className="btn small"
            onClick={() => {
              setResume(0);
              setIndex(Math.min(resume - 1, total - 1));
            }}
          >
            Lanjutkan
          </button>
        </p>
      )}

      <div className="spread" key={index}>
        <div className="art-frame">
          {!touched && <div className="touch-hint">👆 Sentuh gambarnya!</div>}
          <Scene
            interactive
            onInteract={() => setTouched(true)}
            scene={page ? page.scene : book.cover}
            className="art"
            extend={full ? 110 : 0}
            fit={full ? (portrait ? 'xMidYMid meet' : 'xMidYMax slice') : undefined}
          />
        </div>
        <article className="story">
          {page ? (
            <>
              <p className="story-text">{page.text}</p>
              <button className="btn small" onClick={toggleSpeak}>
                {speaking ? '⏹ Berhenti' : '🔊 Bacakan'}
              </button>
            </>
          ) : (
            <>
              <h2>Tamat 🎉</h2>
              {book.moral && (
                <p className="story-text">
                  <strong>Pesan cerita:</strong> {book.moral}
                </p>
              )}
              <div className="hero-actions">
                <button className="btn primary" onClick={() => setIndex(0)}>Baca lagi</button>
                <a className="btn" href="#/">Pilih buku lain</a>
                {!book.is_seed && <button className="btn danger" onClick={remove}>Hapus buku</button>}
              </div>
            </>
          )}
        </article>
      </div>

      <div className="pager">
        <button className="btn" onClick={() => move(-1)} disabled={index === 0} aria-label="Halaman sebelumnya">‹</button>
        <div className="dots" role="tablist">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              className={'dot' + (i === index ? ' on' : '')}
              onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false); setIndex(i); }}
              aria-label={`Ke halaman ${i + 1}`}
            />
          ))}
        </div>
        <button className="btn primary" onClick={() => move(1)} disabled={index === total - 1} aria-label="Halaman berikutnya">›</button>
      </div>
    </section>
  );
}
