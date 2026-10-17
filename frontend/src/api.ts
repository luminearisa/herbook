import type { Book, BookSummary } from './types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Gagal (${res.status})`);
  return data as T;
}

export const api = {
  books: () => request<BookSummary[]>('/api/books'),
  book: (slug: string) => request<Book>(`/api/books/${slug}`),
  generate: (prompt: string) =>
    request<{ book: Book; mode: 'ai' | 'offline'; note: string | null }>('/api/books/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
  remove: (slug: string) => request<{ ok: true }>(`/api/books/${slug}`, { method: 'DELETE' }),
};
