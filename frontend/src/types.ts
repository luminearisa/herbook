export type Mood = 'senang' | 'takut' | 'licik' | 'sedih' | 'marah' | 'kaget' | 'pingsan';
export type Pose = 'berdiri' | 'lari' | 'lompat' | 'rebah' | 'renang' | 'tidur' | 'duduk' | 'salam' | 'doa';
export type Bg = 'hutan' | 'sungai' | 'kebun' | 'desa' | 'malam' | 'senja' | 'gurun' | 'salju' | 'dalamrumah' | 'laut' | 'lautmalam' | 'lautbelah' | 'padang' | 'padangmalam';

export type Category = 'dongeng' | 'islami' | 'fabel' | 'adab';

export interface SceneItem {
  t: string;
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  pose?: Pose;
  mood?: Mood;
  v?: number;
}

export interface SceneData {
  bg: Bg;
  items: SceneItem[];
}

export interface BookSummary {
  slug: string;
  title: string;
  /** Judul versi bahasa Inggris (kosong bila belum ada terjemahan). */
  title_en?: string;
  author: string;
  summary: string;
  summary_en?: string;
  moral: string;
  cover: SceneData;
  category: Category;
  is_seed: boolean;
  /** Benar bila teks cerita punya terjemahan Inggris lengkap. */
  has_en?: boolean;
  page_count: number;
}

export interface Book extends BookSummary {
  moral_en?: string;
  pages: { text: string; text_en?: string; scene: SceneData }[];
}

export interface LessonSummary {
  slug: string;
  series: string;
  part: number;
  title: string;
  title_en?: string;
  summary: string;
  summary_en?: string;
  cover: SceneData;
  has_en?: boolean;
  page_count: number;
  quiz_count: number;
}

export interface LessonPage {
  title: string;
  title_en?: string;
  text: string;
  text_en?: string;
  fact: string;
  fact_en?: string;
  reflection: string;
  reflection_en?: string;
  scene: SceneData;
}

export interface QuizQuestion {
  q: string;
  q_en?: string;
  options: string[];
  options_en?: string[];
  answer: number;
  explain: string;
  explain_en?: string;
}

export interface Lesson extends LessonSummary {
  pages: LessonPage[];
  quiz: QuizQuestion[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  whatsapp: string;
}

export type ProgressKind = 'book' | 'lesson';

export interface ProgressItem {
  kind: ProgressKind;
  slug: string;
  page: number;
  total: number;
  completed: boolean;
  updated_at: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  username: string;
  password: string;
  whatsapp?: string;
}

/** Modul English untuk balita. */
export interface EnglishWord {
  en: string;
  id: string;
  emoji: string;
}

export interface EnglishTopicSummary {
  slug: string;
  title: string;
  title_en?: string;
  summary: string;
  emoji: string;
  word_count: number;
}

export interface EnglishTopic extends EnglishTopicSummary {
  words: EnglishWord[];
}
