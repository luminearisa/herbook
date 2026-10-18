import { toggleLang, useLang } from './lang';

/** Tombol ganti bahasa isi cerita & materi: Indonesia ⇄ Inggris. */
export function LanguageToggle() {
  const lang = useLang();
  const en = lang === 'en';
  return (
    <button
      type="button"
      className="lang-btn"
      onClick={toggleLang}
      aria-pressed={en}
      aria-label={en ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
      title={en ? 'Bahasa Indonesia' : 'English'}
    >
      <span className={en ? '' : 'on'}>ID</span>
      <span className={en ? 'on' : ''}>EN</span>
    </button>
  );
}
