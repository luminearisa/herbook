import { useSyncExternalStore } from 'react';
import { api } from './api';
import * as progress from './progress';
import type { RegisterInput, User } from './types';

/** Status akun pengguna. Sesi disimpan server lewat cookie HttpOnly. */

interface AuthState {
  user: User | null;
  ready: boolean;
}

let snap: AuthState = { user: null, ready: false };
let started = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const fn of listeners) fn();
}

function set(user: User | null, ready = true): void {
  snap = { user, ready };
  emit();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot(): AuthState {
  return snap;
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function isLoggedIn(): boolean {
  return snap.user !== null;
}

/** Periksa sesi yang tersimpan (dipanggil sekali saat aplikasi dibuka). */
export function init(): void {
  if (started) return;
  started = true;
  api
    .me()
    .then((res) => {
      progress.setSyncEnabled(!!res.user);
      set(res.user);
      if (res.user) progress.pullFromServer().catch(() => {});
    })
    .catch(() => set(null));
}

async function afterLogin(user: User): Promise<User> {
  progress.setSyncEnabled(true);
  set(user);
  // Gabungkan riwayat tamu di perangkat ini ke akun, lalu ambil gabungannya.
  await progress.pushToServer().catch(() => {});
  await progress.pullFromServer().catch(() => {});
  return user;
}

export async function login(identifier: string, password: string): Promise<User> {
  const { user } = await api.login(identifier, password);
  return afterLogin(user);
}

export async function register(input: RegisterInput): Promise<User> {
  const { user } = await api.register(input);
  return afterLogin(user);
}

export async function logout(): Promise<void> {
  await api.logout().catch(() => {});
  progress.setSyncEnabled(false);
  set(null);
}
