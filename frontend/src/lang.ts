import { useSyncExternalStore } from 'react';

/**
 * Bahasa tampilan cerita & materi. Pilihan disimpan di perangkat (localStorage)
 * supaya tetap sama saat dibuka lagi. Label antarmuka tetap berbahasa Indonesia.
 */

export type Lang = 'id' | 'en';

const KEY = 'herbook-lang';
const listeners = new Set<() => void>();

let lang: Lang = (() => {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'id';
  } catch {
    return 'id';
  }
})();

function applyDocumentLang(): void {
  try {
    document.documentElement.lang = lang === 'en' ? 'en' : 'id';
  } catch {
    /* abaikan */
  }
}

applyDocumentLang();

export function getLang(): Lang {
  return lang;
}

export function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* penyimpanan tidak tersedia, abaikan */
  }
  applyDocumentLang();
  listeners.forEach((fn) => fn());
}

export function toggleLang(): void {
  setLang(lang === 'en' ? 'id' : 'en');
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => lang,
    () => lang,
  );
}

/** Pilih teks sesuai bahasa aktif; kembali ke bahasa Indonesia bila terjemahan kosong. */
export function pick(id: string, en?: string | null): string {
  return lang === 'en' && en ? en : id;
}
