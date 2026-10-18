import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { pick, useLang } from '../lang';
import { SoundToggle } from '../SoundToggle';
import { playSound, speak } from '../sound';
import type { EnglishTopic, EnglishTopicSummary, EnglishWord } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Halaman utama modul English: daftar topik kosakata untuk balita. */
export function English() {
  const [topics, setTopics] = useState<EnglishTopicSummary[] | null>(null);
  const [error, setError] = useState('');
  useLang(); // ikut berubah saat bahasa diganti
  const titleOf = (t: EnglishTopicSummary) => pick(t.title, t.title_en);
  const total = topics?.reduce((n, t) => n + t.word_count, 0) ?? 0;

  useEffect(() => {
    api.english().then(setTopics).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Bahasa Inggris untuk balita</p>
          <h1>Belajar <em>English</em> sambil bermain</h1>
          <p>
            Sentuh gambar untuk mendengar kata bahasa Inggris beserta artinya dalam bahasa
            Indonesia. Setelah hafal, coba mode latihan: dengar katanya, lalu pilih gambar yang tepat.
          </p>
          <div className="hero-actions">
            {topics?.[0] && <a className="btn primary" href={`#/english/${topics[0].slug}`}>Mulai belajar</a>}
            <a className="btn" href="#/sekitar">🌿 Mengenal Sekitar</a>
          </div>
        </div>
        <div className="hero-art english-art" aria-hidden>
          <span>🍎</span><span>🐱</span><span>🔢</span>
          <span>🎨</span><span>👋</span><span>🐘</span>
        </div>
      </section>

      <section className="section">
        <h2>Topik</h2>
        {error && <p className="error">{error}</p>}
        {!topics && !error && <p className="muted">Memuat topik…</p>}
        <div className="topic-grid">
          {topics?.map((t) => (
            <a key={t.slug} href={`#/english/${t.slug}`} className="topic-card">
              <span className="topic-emoji" aria-hidden>{t.emoji}</span>
              <h3>{titleOf(t)}</h3>
              <small>{t.word_count} kata</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Tips untuk ayah dan ibu</h2>
        <div className="soon">
          <div className="soon-card" aria-disabled>
            <span className="soon-icon">👆</span><strong>Sentuh gambar</strong>
            <small>Kata bahasa Inggrisnya langsung diucapkan.</small>
          </div>
          <div className="soon-card" aria-disabled>
            <span className="soon-icon">🗣️</span><strong>Ulangi bersama</strong>
            <small>Ajak anak menirukan kata yang sama.</small>
          </div>
          <div className="soon-card" aria-disabled>
            <span className="soon-icon">🎧</span><strong>Mode latihan</strong>
            <small>Dengarkan, lalu pilih gambar yang benar.</small>
          </div>
          <div className="soon-card" aria-disabled>
            <span className="soon-icon">⭐</span><strong>Beri pujian</strong>
            <small>Setiap jawaban benar mendapat bintang.</small>
          </div>
        </div>
        {total > 0 && <p className="muted english-total">{topics?.length} topik · {total} kata untuk dipelajari bersama.</p>}
      </section>
    </>
  );
}

/** Satu topik: mode Belajar (sentuh kartu) dan Latihan (dengar lalu pilih gambar). */
export function EnglishTopicView({ slug }: { slug: string }) {
  const [topic, setTopic] = useState<EnglishTopic | null>(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'belajar' | 'latihan'>('belajar');

  useEffect(() => {
    setTopic(null);
    setError('');
    setMode('belajar');
    api.englishTopic(slug).then(setTopic).catch((e: Error) => setError(e.message));
    return () => window.speechSynthesis?.cancel();
  }, [slug]);

  if (error) return <p className="error narrow section">{error}</p>;
  if (!topic) return <p className="muted narrow section">Memuat topik…</p>;

  return (
    <section className="section narrow english-topic">
      <div className="english-head">
        <a href="#/english" className="back">← English untuk Balita</a>
        <SoundToggle />
      </div>
      <h1 className="english-title"><span aria-hidden>{topic.emoji}</span> {topic.title}</h1>
      <p className="muted">{topic.summary}</p>
      <div className="mode-tabs" role="tablist">
        <button role="tab" aria-selected={mode === 'belajar'} className={'tab' + (mode === 'belajar' ? ' on' : '')} onClick={() => setMode('belajar')}>
          👆 Belajar
        </button>
        <button role="tab" aria-selected={mode === 'latihan'} className={'tab' + (mode === 'latihan' ? ' on' : '')} onClick={() => setMode('latihan')}>
          🎧 Latihan
        </button>
      </div>
      {mode === 'belajar'
        ? <Learn words={topic.words} />
        : <Practice key={slug + ':' + topic.words.length} words={topic.words} />}
    </section>
  );
}

function Learn({ words }: { words: EnglishWord[] }) {
  const [pop, setPop] = useState<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function say(w: EnglishWord) {
    window.speechSynthesis?.cancel();
    speak(w.en, 'chime', 'en-US');
    setPop(w.en);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPop(null), 600);
  }

  return (
    <>
      <p className="muted">Sentuh kartu untuk mendengar kata bahasa Inggrisnya. 🔊</p>
      <div className="word-grid">
        {words.map((w) => (
          <button key={w.en} className={'word-card' + (pop === w.en ? ' pop' : '')} onClick={() => say(w)} lang="en">
            <span className="word-emoji" aria-hidden>{w.emoji}</span>
            <strong className="word-en">{w.en}</strong>
            <span className="word-id">{w.id}</span>
          </button>
        ))}
      </div>
    </>
  );
}

interface Round { word: EnglishWord; options: EnglishWord[] }

function Practice({ words }: { words: EnglishWord[] }) {
  const [seed, setSeed] = useState(0);
  const rounds = useMemo<Round[]>(() => {
    void seed;
    const pool = shuffle(words).slice(0, Math.min(8, words.length));
    return pool.map((w) => ({
      word: w,
      options: shuffle([w, ...shuffle(words.filter((x) => x.en !== w.en)).slice(0, 3)]),
    }));
  }, [words, seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= rounds.length;
  const round = rounds[i];

  // Ucapkan kata tiap kali soal berganti (butuh sentuhan pertama dari pengguna).
  useEffect(() => {
    if (done || !round) return;
    const t = window.setTimeout(() => speak(round.word.en, 'chime', 'en-US'), 350);
    return () => window.clearTimeout(t);
  }, [round, done]);

  function restart() {
    setSeed((s) => s + 1);
    setI(0);
    setPicked(null);
    setScore(0);
  }

  if (done) {
    const stars = Math.round((score / rounds.length) * 5);
    return (
      <div className="quiz">
        <h2 className="lesson-title">Hasil latihan</h2>
        <p className="stars" aria-label={`${stars} dari 5 bintang`}>{'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}</p>
        <p className="story-text">
          Kamu benar {score} dari {rounds.length} soal.{' '}
          {score === rounds.length ? 'Great job! Hebat sekali!' : 'Good try! Ayo ulangi lagi ya.'}
        </p>
        <div className="hero-actions">
          <button className="btn primary" onClick={restart}>Ulangi latihan</button>
          <a className="btn" href="#/english">Topik lain</a>
        </div>
      </div>
    );
  }

  function choose(o: EnglishWord) {
    if (picked !== null) return;
    setPicked(o.en);
    if (o.en === round.word.en) {
      setScore((s) => s + 1);
      playSound('rainbow');
      speak(`Yes! ${round.word.en}`, '', 'en-US');
    } else {
      playSound('plop');
    }
  }

  return (
    <div className="quiz">
      <p className="muted">Soal {i + 1} dari {rounds.length}</p>
      <h2 className="lesson-title">Mana gambar “{round.word.en}”?</h2>
      <button className="btn small english-listen" onClick={() => speak(round.word.en, 'chime', 'en-US')}>
        🔊 Dengarkan lagi
      </button>
      <div className="tiles">
        {round.options.map((o) => (
          <button
            key={o.en}
            className={'tile' + (picked !== null ? (o.en === round.word.en ? ' right' : o.en === picked ? ' wrong' : '') : '')}
            onClick={() => choose(o)}
            disabled={picked !== null}
          >
            <span className="tile-emoji" aria-hidden>{o.emoji}</span>
            {picked !== null && <small>{o.en}</small>}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="feedback">
            {picked === round.word.en ? '✅ Benar!' : '❌ Belum tepat.'} {round.word.en} = {round.word.id}.
          </p>
          <button className="btn primary small" onClick={() => { setI(i + 1); setPicked(null); }}>
            {i + 1 === rounds.length ? 'Lihat hasil' : 'Soal berikutnya'}
          </button>
        </>
      )}
    </div>
  );
}
