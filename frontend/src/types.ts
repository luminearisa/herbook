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
  author: string;
  summary: string;
  moral: string;
  cover: SceneData;
  category: Category;
  is_seed: boolean;
  page_count: number;
}

export interface Book extends BookSummary {
  pages: { text: string; scene: SceneData }[];
}

export interface LessonSummary {
  slug: string;
  series: string;
  part: number;
  title: string;
  summary: string;
  cover: SceneData;
  page_count: number;
  quiz_count: number;
}

export interface LessonPage {
  title: string;
  text: string;
  fact: string;
  reflection: string;
  scene: SceneData;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
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
