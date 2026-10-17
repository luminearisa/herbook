import { useCallback, useEffect, useRef, useState } from 'react';
import { go } from '../App';
import { api } from '../api';
import { Scene } from '../scene/Scene';
import type { Book } from '../types';

export function Reader({ slug }: { slug: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const touchX = useRef<number | null>(null);
  const [note] = useState(() => {
    const n = sessionStorage.getItem('herbook-note');
    sessionStorage.removeItem('herbook-note');
    return n;
  });

  useEffect(() => {
    api.book(slug).then(setBook).catch((e: Error) => setError(e.message));
    return () => window.speechSynthesis?.cancel();
  }, [slug]);

  const total = book ? book.pages.length + 1 : 0; // + halaman penutup
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
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

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
      className="reader"
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
        <span className="muted">{isEnd ? 'Tamat' : `Halaman ${index + 1} dari ${book.pages.length}`}</span>
      </div>
      {note && <p className="note">{note}</p>}

      <div className="spread" key={index}>
        <div className="art-frame">
          <Scene scene={page ? page.scene : book.cover} className="art" />
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
