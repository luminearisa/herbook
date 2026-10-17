export type Mood = 'senang' | 'takut' | 'licik' | 'sedih' | 'marah' | 'kaget' | 'pingsan';
export type Pose = 'berdiri' | 'lari' | 'lompat' | 'rebah' | 'renang' | 'tidur';
export type Bg = 'hutan' | 'sungai' | 'kebun' | 'desa' | 'malam' | 'senja' | 'gurun' | 'salju';

export type Category = 'dongeng' | 'islami' | 'fabel';

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
