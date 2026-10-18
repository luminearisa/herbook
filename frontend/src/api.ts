import type {
  Book,
  BookSummary,
  Category,
  EnglishTopic,
  EnglishTopicSummary,
  Lesson,
  LessonSummary,
  ProgressItem,
  RegisterInput,
  User,
} from './types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Gagal (${res.status})`);
  return data as T;
}

export const api = {
  books: () => request<BookSummary[]>('/api/books'),
  book: (slug: string) => request<Book>(`/api/books/${slug}`),
  generate: (prompt: string, category: Category) =>
    request<{ book: Book; mode: 'ai' | 'offline'; note: string | null }>('/api/books/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, category }),
    }),
  lessons: () => request<LessonSummary[]>('/api/lessons'),
  lesson: (slug: string) => request<Lesson>(`/api/lessons/${slug}`),
  english: () => request<EnglishTopicSummary[]>('/api/english'),
  englishTopic: (slug: string) => request<EnglishTopic>(`/api/english/${slug}`),
  remove: (slug: string) => request<{ ok: true }>(`/api/books/${slug}`, { method: 'DELETE' }),

  me: () => request<{ user: User | null }>('/api/auth/me'),
  register: (input: RegisterInput) =>
    request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (identifier: string, password: string) =>
    request<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  updateProfile: (input: { name: string; whatsapp?: string }) =>
    request<{ user: User }>('/api/auth/profile', { method: 'POST', body: JSON.stringify(input) }),
  changePassword: (current: string, password: string) =>
    request<{ ok: true }>('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({ current, password }),
    }),

  progress: () => request<{ items: ProgressItem[] }>('/api/progress'),
  saveProgress: (item: { kind: string; slug: string; page: number; total: number; completed: boolean }) =>
    request<{ ok: boolean }>('/api/progress', { method: 'POST', body: JSON.stringify(item) }),
  mergeProgress: (items: { kind: string; slug: string; page: number; total: number; completed: boolean }[]) =>
    request<{ items: ProgressItem[] }>('/api/progress/merge', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};
