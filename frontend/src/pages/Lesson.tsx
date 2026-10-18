import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { api } from '../api';
import { LanguageToggle } from '../LanguageToggle';
import { pick, useLang } from '../lang';
import { getEntry, save } from '../progress';
import { Scene } from '../scene/Scene';
import { SoundToggle } from '../SoundToggle';
import { playSound } from '../sound';
import type { Lesson as LessonData, QuizQuestion } from '../types';

export function Lesson({ slug }: { slug: string }) {
  const lang = useLang();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [touched, setTouched] = useState(false);
  const [full, setFull] = useState(false);
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth);
  const [alpha, setAlpha] = useState(() => {
    try {
      return Number(localStorage.getItem('herbook-text-alpha')) || 78;
    } catch {
      return 78;
    }
  });
  const root = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const [resume, setResume] = useState(0);

  useEffect(() => {
    api.lesson(slug).then(setLesson).catch((e: Error) => setError(e.message));
    return () => window.speechSynthesis?.cancel();
  }, [slug]);

  const total = lesson ? lesson.pages.length + (lesson.quiz.length ? 1 : 0) : 0;

  // Catat riwayat belajar: sampai pelajaran berapa materi ini dipelajari.
  useEffect(() => {
    if (!lesson) return;
    save(
      'lesson',
      lesson.slug,
      lesson.title,
      Math.min(index + 1, lesson.pages.length),
      lesson.pages.length,
      index >= lesson.pages.length,
    );
  }, [lesson, index]);

  useEffect(() => {
    if (!lesson) {
      setResume(0);
      return;
    }
    const p = getEntry('lesson', lesson.slug);
    setResume(p && !p.completed && p.page > 0 && p.page < lesson.pages.length ? p.page : 0);
  }, [lesson]);

  useEffect(() => {
    if (index !== 0) setResume(0);
  }, [index]);

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };
  const go = useCallback((i: number) => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setIndex(Math.max(0, Math.min(total - 1, i)));
  }, [total]);

  const enterFull = useCallback(() => {
    setFull(true);
    root.current?.requestFullscreen?.().catch(() => {});
  }, []);
  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setFull(false); };
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
    try { localStorage.setItem('herbook-text-alpha', String(alpha)); } catch { /* abaikan */ }
  }, [alpha]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'f' || e.key === 'F') (full ? exitFull : enterFull)();
      if (e.key === 'Escape' && full) exitFull();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, full, enterFull, exitFull]);

  if (error) return <p className="error narrow section">{error}</p>;
  if (!lesson) return <p className="muted narrow section">Membuka materi…</p>;

  const page = lesson.pages[index];
  const isQuiz = !page;
  const pageTitle = page ? pick(page.title, page.title_en) : '';
  const pageText = page ? pick(page.text, page.text_en) : '';
  const pageFact = page ? pick(page.fact, page.fact_en) : '';
  const pageReflection = page ? pick(page.reflection, page.reflection_en) : '';
  const quiz: QuizQuestion[] = lesson.quiz.map((q) => ({
    q: pick(q.q, q.q_en),
    options: lang === 'en' && q.options_en?.length === q.options.length ? q.options_en : q.options,
    answer: q.answer,
    explain: pick(q.explain, q.explain_en),
  }));

  function toggleSpeak() {
    const synth = window.speechSynthesis;
    if (!synth || !page) return;
    if (speaking) { stopSpeech(); return; }
    const didYouKnow = lang === 'en' ? 'Did you know? ' : 'Tahukah kamu? ';
    const u = new SpeechSynthesisUtterance(`${pageTitle}. ${pageText} ${pageFact ? didYouKnow + pageFact : ''}`);
    u.lang = lang === 'en' ? 'en-US' : 'id-ID';
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  }

  return (
    <section
      ref={root}
      className={'reader lesson' + (full ? ' full' : '')}
      style={{ '--text-alpha': alpha / 100 } as CSSProperties}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="reader-head">
        <a href="#/sekitar" className="back">← Mengenal Sekitar</a>
        <h1>{pick(lesson.title, lesson.title_en)}</h1>
        <span className="muted page-count">{isQuiz ? 'Kuis' : `Pelajaran ${index + 1} dari ${lesson.pages.length}`}</span>
        {full && (
          <label className="alpha-ctl">
            Teks
            <input type="range" min={30} max={100} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} aria-label="Kepekatan latar teks" />
          </label>
        )}
        <LanguageToggle />
        <SoundToggle />
        <button className="btn small" onClick={full ? exitFull : enterFull} aria-pressed={full}>
          {full ? '✕ Keluar' : '⛶ Layar penuh'}
        </button>
      </div>

      {resume > 0 && index === 0 && (
        <p className="note resume-note">
          🌿 Terakhir kamu sampai pelajaran {resume}.{' '}
          <button
            className="btn small"
            onClick={() => {
              setResume(0);
              go(resume - 1);
            }}
          >
            Lanjutkan
          </button>
        </p>
      )}

      <div className="spread" key={index}>
        <div className="art-frame">
          {!touched && <div className="touch-hint">👆 Sentuh benda di gambar!</div>}
          <Scene
            interactive
            showNames
            lang={lang}
            onInteract={() => setTouched(true)}
            scene={page ? page.scene : lesson.cover}
            className="art"
            extend={full ? 110 : 0}
            fit={full ? (portrait ? 'xMidYMid meet' : 'xMidYMax slice') : undefined}
          />
        </div>
        <article className="story">
          {page ? (
            <>
              <h2 className="lesson-title">{pageTitle}</h2>
              <p className="story-text">{pageText}</p>
              {pageFact && (
                <div className="fact"><strong>💡 Tahukah kamu?</strong> {pageFact}</div>
              )}
              {pageReflection && <p className="reflection">🌿 {pageReflection}</p>}
              <button className="btn small" onClick={toggleSpeak}>{speaking ? '⏹ Berhenti' : '🔊 Bacakan'}</button>
            </>
          ) : (
            <Quiz questions={quiz} onBack={() => go(0)} />
          )}
        </article>
      </div>

      <div className="pager">
        <button className="btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Sebelumnya">‹</button>
        <div className="dots">
          {Array.from({ length: total }, (_, i) => (
            <button key={i} className={'dot' + (i === index ? ' on' : '')} onClick={() => go(i)} aria-label={i === total - 1 && lesson.quiz.length ? 'Kuis' : `Pelajaran ${i + 1}`} />
          ))}
        </div>
        <button className="btn primary" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Berikutnya">›</button>
      </div>
    </section>
  );
}

function Quiz({ questions, onBack }: { questions: QuizQuestion[]; onBack: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= questions.length;
  const q = questions[i];

  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.answer) {
      setScore((s) => s + 1);
      playSound('rainbow');
    } else {
      playSound('plop');
    }
  }

  if (done) {
    const stars = Math.round((score / questions.length) * 5);
    return (
      <div className="quiz">
        <h2 className="lesson-title">Hasil kuis</h2>
        <p className="stars" aria-label={`${stars} dari 5 bintang`}>{'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}</p>
        <p className="story-text">Kamu benar {score} dari {questions.length} soal. {score === questions.length ? 'Luar biasa, hebat sekali!' : 'Bagus! Baca lagi pelajarannya, lalu coba lagi ya.'}</p>
        <div className="hero-actions">
          <button className="btn primary" onClick={() => { setI(0); setPicked(null); setScore(0); }}>Ulangi kuis</button>
          <button className="btn" onClick={onBack}>Baca lagi dari awal</button>
          <a className="btn" href="#/sekitar">Materi lain</a>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="muted">Soal {i + 1} dari {questions.length}</p>
      <h2 className="lesson-title">{q.q}</h2>
      <div className="options">
        {q.options.map((o, n) => (
          <button
            key={o}
            className={'option' + (picked !== null ? (n === q.answer ? ' right' : n === picked ? ' wrong' : '') : '')}
            onClick={() => pick(n)}
            disabled={picked !== null}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="feedback">{picked === q.answer ? '✅ Benar!' : '❌ Belum tepat.'} {q.explain}</p>
          <button className="btn primary small" onClick={() => { setI(i + 1); setPicked(null); }}>
            {i + 1 === questions.length ? 'Lihat hasil' : 'Soal berikutnya'}
          </button>
        </>
      )}
    </div>
  );
}
