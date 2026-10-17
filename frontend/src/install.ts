import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'herbook-install-dismissed';
const DISMISS_DAYS = 7;

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
let snapshot = compute();
const listeners = new Set<() => void>();

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  // Browser iOS lain (Chrome, Firefox, dll.) tidak bisa "Tambah ke Layar Utama" dari menu yang sama
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

function dismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86400000;
  } catch {
    return false;
  }
}

export interface InstallState {
  /** Browser siap memasang (Chrome/Edge/Android): tombol pasang langsung. */
  canInstall: boolean;
  /** iPhone/iPad Safari: perlu petunjuk manual. */
  needsIosGuide: boolean;
  /** Banner boleh muncul (belum dipasang dan belum ditolak baru-baru ini). */
  showBanner: boolean;
}

function compute(): InstallState {
  const done = installed || isStandalone();
  const canInstall = !done && deferred !== null;
  const needsIosGuide = !done && isIosSafari();
  return { canInstall, needsIosGuide, showBanner: (canInstall || needsIosGuide) && !dismissedRecently() };
}

function notify() {
  snapshot = compute();
  listeners.forEach((l) => l());
}

export function initInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // tahan dialog bawaan; kita tampilkan sendiri
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferred = null;
    notify();
  });
}

export function dismissInstallBanner() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* abaikan */
  }
  notify();
}

/** Memunculkan dialog pasang bawaan browser. Mengembalikan true bila pengguna setuju. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const evt = deferred;
  deferred = null; // event hanya bisa dipakai sekali
  await evt.prompt();
  const { outcome } = await evt.userChoice;
  if (outcome === 'accepted') installed = true;
  notify();
  return outcome === 'accepted';
}

export function useInstall(): InstallState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
  );
}
