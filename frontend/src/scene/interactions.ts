import type { Mood, Pose, SceneItem } from '../types';

export type Fx = 'leaves' | 'fruit' | 'rain' | 'sparkle' | 'splash' | 'flash';

export interface Interaction {
  /** Nama animasi CSS: react-<anim> */
  anim: string;
  sound?: string;
  speak?: string[];
  mood?: Mood;
  pose?: Pose;
  fx?: Fx[];
  /** Kotak asal partikel di koordinat tokoh: [x, y, lebar, tinggi] */
  fxBox?: [number, number, number, number];
  /** Titik putar animasi: 'bottom' (kaki) atau 'center' */
  origin?: 'bottom' | 'center';
}

const PERSON: Interaction = { anim: 'hop2', mood: 'senang', origin: 'bottom' };

const TABLE: Record<string, Interaction> = {
  kancil: { anim: 'jump', sound: 'squeak', mood: 'senang', pose: 'lompat' },
  kelinci: { anim: 'hop2', sound: 'squeak', mood: 'senang' },
  tikus: { anim: 'shake', sound: 'squeak', mood: 'senang' },
  buaya: { anim: 'shake', sound: 'growl', mood: 'marah' },
  harimau: { anim: 'shake', sound: 'roar', mood: 'marah' },
  singa: { anim: 'shake', sound: 'roar', mood: 'marah' },
  gajah: { anim: 'sway', sound: 'trumpet', mood: 'senang' },
  kurakura: { anim: 'wobble', sound: 'plop', mood: 'senang' },
  belalang: { anim: 'jump', sound: 'cricket', mood: 'senang', pose: 'lompat' },
  semut: { anim: 'wiggle', sound: 'tick', mood: 'senang' },
  burung: { anim: 'flyaway', sound: 'tweet', origin: 'center' },
  hudhud: { anim: 'flyaway', sound: 'tweet', origin: 'center' },
  ababil: { anim: 'flyaway', sound: 'tweet', origin: 'center' },
  kupu: { anim: 'flutter', sound: 'chime', origin: 'center' },
  petani: { ...PERSON, speak: ['Halo!', 'Selamat siang!'] },
  anak: { ...PERSON, speak: ['Halo!', "Assalamu'alaikum!", 'Hai, teman!'] },
  dewasa: { ...PERSON, speak: ["Assalamu'alaikum!", 'Halo, Nak!'] },
  buah: { ...PERSON, speak: ['Hehe!', 'Hai!', 'Hore!'], sound: 'boing', pose: 'lompat' },
  pohon: { anim: 'sway', sound: 'rustle', fx: ['leaves'], fxBox: [-70, -200, 140, 90], origin: 'bottom' },
  kurma: { anim: 'sway', sound: 'rustle', fx: ['leaves'], fxBox: [-60, -150, 130, 40], origin: 'bottom' },
  semak: { anim: 'shake', sound: 'rustle', fx: ['leaves'], fxBox: [-40, -50, 80, 20], origin: 'bottom' },
  batu: { anim: 'wobble', sound: 'thump' },
  bunga: { anim: 'wiggle', sound: 'chime', fx: ['sparkle'], fxBox: [-24, -60, 48, 40] },
  awan: { anim: 'drift', sound: 'rain', fx: ['rain'], fxBox: [-50, 10, 100, 10], origin: 'center' },
  rumah: { anim: 'squash', sound: 'knock' },
  pagar: { anim: 'rattle', sound: 'knock' },
  meja: { anim: 'rattle', sound: 'clink' },
  kue: { anim: 'squash', sound: 'chime', fx: ['sparkle'], fxBox: [-40, -50, 80, 30] },
  vas: { anim: 'wobble', sound: 'clink' },
  jaring: { anim: 'stretch', sound: 'thump' },
  tongkat: { anim: 'wobble', sound: 'knock', origin: 'center' },
  bendera: { anim: 'wave', sound: 'fanfare', fx: ['sparkle'], fxBox: [-10, -130, 60, 40] },
  timun: { anim: 'wobble', sound: 'pop' },
  orangorangan: { anim: 'shake', sound: 'creak' },
  kurungan: { anim: 'rattle', sound: 'creak' },
  sumur: { anim: 'squash', sound: 'splash', fx: ['splash'], fxBox: [-30, -56, 60, 10] },
  lubang: { anim: 'wobble', sound: 'thump' },
  surat: { anim: 'flutter', sound: 'chime', origin: 'center' },
  debu: { anim: 'puff', sound: 'rustle', origin: 'center' },
  sarang: { anim: 'wobble', sound: 'thump' },
  paus: { anim: 'squash', sound: 'whale', fx: ['splash'], fxBox: [-20, -165, 40, 20], mood: 'senang' },
  anjing: { anim: 'hop2', sound: 'bark', mood: 'senang' },
  bahtera: { anim: 'wobble', sound: 'creak', origin: 'bottom' },
  gua: { anim: 'squash', sound: 'echo' },
  unta: { anim: 'sway', sound: 'camel', mood: 'senang' },
  tebing: { anim: 'squash', sound: 'echo' },
  gunung: { anim: 'squash', sound: 'echo' },
  piramida: { anim: 'squash', sound: 'echo' },
  matahari: { anim: 'pulse', sound: 'chime', fx: ['sparkle'], fxBox: [-90, -90, 180, 180], origin: 'center' },
  bulan: { anim: 'pulse', sound: 'chime', fx: ['sparkle'], fxBox: [-70, -70, 140, 140], origin: 'center' },
  bintang: { anim: 'pulse', sound: 'twinkle', fx: ['sparkle'], fxBox: [-30, -30, 60, 60], origin: 'center' },
  pelangi: { anim: 'rainbow', sound: 'rainbow', fx: ['sparkle'], fxBox: [-280, -300, 560, 280], origin: 'bottom' },
  petir: { anim: 'flicker', sound: 'thunder', fx: ['flash'], fxBox: [0, -140, 1, 1], origin: 'center' },
  layangan: { anim: 'flyaway', sound: 'whoosh', origin: 'center' },
  kincir: { anim: 'wobble', sound: 'whoosh', origin: 'bottom' },
  angin: { anim: 'drift', sound: 'whoosh', origin: 'center' },
  ikan: { anim: 'flyaway', sound: 'bubble', fx: ['splash'], fxBox: [-10, -20, 30, 10], origin: 'center' },
  api: { anim: 'squash', sound: 'crackle', fx: ['sparkle'], fxBox: [-40, -140, 80, 90] },
  // hujan dan ombak tidak interaktif (hanya hiasan di depan gambar)
  // kabah sengaja tidak ada: tidak dijadikan mainan
};

export function interactionFor(item: SceneItem): Interaction | undefined {
  const base = TABLE[item.t];
  if (!base) return undefined;
  if (item.t === 'api' && item.v === 1) return { ...base, sound: 'chime' };
  if (item.t === 'vas' && item.v === 1) return { ...base, sound: 'tinkle' };
  if (item.t === 'pohon' && item.v === 1) return { ...base, fx: ['leaves', 'fruit'], sound: 'rustle' };
  return base;
}

/** Nama yang ditampilkan dan diucapkan saat benda disentuh di halaman belajar. */
const NAMES: Record<string, string> = {
  matahari: 'Matahari', bulan: 'Bulan', bintang: 'Bintang', awan: 'Awan', pelangi: 'Pelangi', petir: 'Kilat',
  layangan: 'Layang-layang', kincir: 'Kincir angin', angin: 'Angin', pohon: 'Pohon', kurma: 'Pohon kurma',
  bunga: 'Bunga', burung: 'Burung', kupu: 'Kupu-kupu', rumah: 'Rumah', batu: 'Batu', semak: 'Semak',
  kancil: 'Kancil', gajah: 'Gajah', kelinci: 'Kelinci', ikan: 'Ikan', semut: 'Semut',
  pagar: 'Pagar', meja: 'Meja', vas: 'Vas bunga', kue: 'Kue', sumur: 'Sumur', tongkat: 'Tongkat',
  kurungan: 'Kurungan', timun: 'Timun', gunung: 'Gunung',
};
const NAMES_EN: Record<string, string> = {
  matahari: 'The Sun', bulan: 'The Moon', bintang: 'Star', awan: 'Cloud', pelangi: 'Rainbow', petir: 'Lightning',
  layangan: 'Kite', kincir: 'Windmill', angin: 'Wind', pohon: 'Tree', kurma: 'Date palm',
  bunga: 'Flower', burung: 'Bird', kupu: 'Butterfly', rumah: 'House', batu: 'Stone', semak: 'Bush',
  kancil: 'Mouse deer', gajah: 'Elephant', kelinci: 'Rabbit', ikan: 'Fish', semut: 'Ant',
  pagar: 'Fence', meja: 'Table', vas: 'Flower vase', kue: 'Cake', sumur: 'Well', tongkat: 'Walking stick',
  kurungan: 'Cage', timun: 'Cucumber', gunung: 'Mountain',
};
const FRUITS = ['Apel', 'Jeruk', 'Pisang', 'Semangka', 'Stroberi', 'Anggur'];
const FRUITS_EN = ['Apple', 'Orange', 'Banana', 'Watermelon', 'Strawberry', 'Grape'];
const MOON = ['Bulan purnama', 'Bulan sabit', 'Bulan separuh'];
const MOON_EN = ['Full moon', 'Crescent moon', 'Half moon'];

export function nameFor(item: SceneItem, lang: 'id' | 'en' = 'id'): string | undefined {
  const en = lang === 'en';
  if (item.t === 'buah') return (en ? FRUITS_EN : FRUITS)[item.v ?? 0];
  if (item.t === 'bulan') return (en ? MOON_EN : MOON)[item.v ?? 0] ?? (en ? 'Moon' : 'Bulan');
  if (item.t === 'awan' && (item.v ?? 0) >= 2) return en ? 'Overcast cloud' : 'Awan mendung';
  return (en ? NAMES_EN : NAMES)[item.t];
}

/** Kalimat pendek tokoh (manusia) saat disentuh, sesuai bahasa aktif. */
const SPEAK_EN: Record<string, string[]> = {
  petani: ['Hello!', 'Good afternoon!'],
  anak: ['Hello!', "Assalamu'alaikum!", 'Hi, friend!'],
  dewasa: ["Assalamu'alaikum!", 'Hello, child!'],
  buah: ['Hehe!', 'Hi!', 'Hooray!'],
};

export function speechFor(item: SceneItem, cfg: Interaction, lang: 'id' | 'en' = 'id'): string | undefined {
  const lines = (lang === 'en' ? SPEAK_EN[item.t] : undefined) ?? cfg.speak;
  if (!lines || lines.length === 0) return undefined;
  return lines[Math.floor(Math.random() * lines.length)];
}
