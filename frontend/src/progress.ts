import { useSyncExternalStore } from 'react';
import { api } from './api';
import type { ProgressItem, ProgressKind } from './types';

/**
 * Riwayat baca. Untuk tamu (belum masuk) semua disimpan di localStorage browser.
 * Saat pengguna masuk, riwayat lokal digabung ke server dan selanjutnya ikut tersimpan
 * di akun, sehingga bisa dibuka dari perangkat lain.
 */

export interface ProgressEntry {
  page: number;
  total: number;
  completed: boolean;
  updatedAt: number;
  title?: string;
}

type ProgressMap = Record<string, ProgressEntry>;

const KEY = 'herbook-progress';

function keyOf(kind: ProgressKind, slug: string): string {
  return `${kind}:${slug}`;
}

function read(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === 'object') return data as ProgressMap;
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return {};
}

let state: ProgressMap = read();
let syncEnabled = false;
const listeners = new Set<() => void>();

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* abaikan */
  }
}

function commit(next: ProgressMap): void {
  state = next;
  persist();
  for (const fn of listeners) fn();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot(): ProgressMap {
  return state;
}

/** Hook React: peta riwayat baca, ikut ter-render ulang saat berubah. */
export function useProgress(): ProgressMap {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getEntry(kind: ProgressKind, slug: string): ProgressEntry | undefined {
  return state[keyOf(kind, slug)];
}

/** Semua riwayat, diurutkan dari yang terbaru dibaca. */
export function recent(limit = 6): { kind: ProgressKind; slug: string; entry: ProgressEntry }[] {
  return Object.entries(state)
    .map(([k, entry]) => {
      const [kind, slug] = k.split(':');
      return { kind: kind as ProgressKind, slug, entry };
    })
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt)
    .slice(0, limit);
}

/** Riwayat terbaru untuk satu jenis (book/lesson). */
export function lastRead(kind: ProgressKind): { slug: string; entry: ProgressEntry } | null {
  return recent(50).find((r) => r.kind === kind) ?? null;
}

/** Simpan progres. Halaman tidak pernah mundur dan penanda selesai tidak hilang. */
export function save(
  kind: ProgressKind,
  slug: string,
  title: string,
  page: number,
  total: number,
  completed: boolean,
): void {
  const key = keyOf(kind, slug);
  const cur = state[key];
  const entry: ProgressEntry = {
    page: Math.max(cur?.page ?? 0, page),
    total: Math.max(cur?.total ?? 0, total),
    completed: (cur?.completed ?? false) || completed,
    updatedAt: Date.now(),
    title: title || cur?.title,
  };
  if (
    cur &&
    cur.page === entry.page &&
    cur.total === entry.total &&
    cur.completed === entry.completed
  ) {
    // Isi tidak berubah, cukup perbarui waktu baca terakhir.
    commit({ ...state, [key]: entry });
    return;
  }
  commit({ ...state, [key]: entry });
  if (syncEnabled) {
    api
      .saveProgress({ kind, slug, page: entry.page, total: entry.total, completed: entry.completed })
      .catch(() => {});
  }
}

/** Aktifkan/nonaktifkan sinkronisasi ke server (dipakai saat login/logout). */
export function setSyncEnabled(on: boolean): void {
  syncEnabled = on;
}

/** Gabungkan riwayat dari server ke penyimpanan lokal. */
export function mergeServer(items: ProgressItem[]): void {
  if (!items.length) return;
  const next = { ...state };
  for (const it of items) {
    const key = keyOf(it.kind, it.slug);
    const cur = next[key];
    next[key] = {
      page: Math.max(cur?.page ?? 0, it.page),
      total: Math.max(cur?.total ?? 0, it.total),
      completed: (cur?.completed ?? false) || it.completed,
      updatedAt: cur?.updatedAt ?? Date.now(),
      title: cur?.title,
    };
  }
  commit(next);
}

/** Tarik riwayat dari server (pengguna login). */
export async function pullFromServer(): Promise<void> {
  if (!syncEnabled) return;
  const { items } = await api.progress();
  mergeServer(items);
}

/** Kirim riwayat lokal ke server, lalu tarik hasil gabungannya. */
export async function pushToServer(): Promise<void> {
  if (!syncEnabled) return;
  const items = Object.entries(state).map(([k, entry]) => {
    const [kind, slug] = k.split(':');
    return { kind, slug, page: entry.page, total: entry.total, completed: entry.completed };
  });
  if (items.length) await api.mergeProgress(items);
}
