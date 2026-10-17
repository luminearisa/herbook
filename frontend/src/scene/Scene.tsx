import type { ReactElement } from 'react';
import type { SceneData, SceneItem } from '../types';
import { Background, Overlay } from './Background';
import { Ababil, Anak, Buaya, Burung, Dewasa, Gajah, Harimau, Belalang, Buah, Hudhud, Kancil, Kelinci, Kupu, Kurakura, Lubang, Petani, Semut, Singa, Tikus, type CharProps } from './characters';
import { Awan, Batu, Bendera, Bunga, Debu, Jaring, Kue, Meja, Vas, Kabah, Kurma, Kurungan, Orangorangan, Pagar, Pohon, Rumah, Sarang, Semak, Sumur, Surat, Timun, Tongkat } from './props';

const REGISTRY: Record<string, (p: CharProps) => ReactElement> = {
  kancil: Kancil, buaya: Buaya, harimau: Harimau, gajah: Gajah, petani: Petani, kurakura: Kurakura,
  burung: Burung, kupu: Kupu, pohon: Pohon, semak: Semak, batu: Batu, bunga: Bunga,
  awan: Awan, timun: Timun, orangorangan: Orangorangan, rumah: Rumah, kurungan: Kurungan, pagar: Pagar,
  kabah: Kabah, semut: Semut, hudhud: Hudhud, ababil: Ababil, kurma: Kurma, surat: Surat, debu: Debu, sarang: Sarang,
  kelinci: Kelinci, belalang: Belalang, singa: Singa, tikus: Tikus, bendera: Bendera, jaring: Jaring,
  anak: Anak, dewasa: Dewasa, meja: Meja, vas: Vas, kue: Kue, sumur: Sumur, tongkat: Tongkat, buah: Buah, lubang: Lubang,
};

// Hewan/orang yang bergerak halus supaya gambar terasa hidup.
const LIVELY = new Set(['kancil', 'buaya', 'harimau', 'gajah', 'petani', 'kurakura', 'semut', 'kelinci', 'singa', 'tikus', 'belalang', 'anak', 'dewasa', 'buah']);

function Item({ item }: { item: SceneItem }) {
  const Comp = REGISTRY[item.t];
  if (!Comp) return null;
  const s = item.s ?? 1;
  const bob = LIVELY.has(item.t) && item.pose !== 'rebah' && item.pose !== 'tidur';
  const slow = item.t === 'buaya' ? 'bob slow' : 'bob';
  return (
    <g transform={`translate(${item.x} ${item.y}) scale(${item.flip ? -s : s} ${s})`}>
      <g className={bob ? slow : undefined}>
        <Comp pose={item.pose} mood={item.mood} v={item.v} />
      </g>
    </g>
  );
}

interface SceneProps {
  scene: SceneData;
  className?: string;
  /** Tinggi tambahan di bawah kanvas (unit viewBox) agar tokoh tidak tertutup teks di layar penuh. */
  extend?: number;
  /** Nilai preserveAspectRatio; bawaan 'xMidYMid slice'. */
  fit?: string;
}

export function Scene({ scene, className, extend = 0, fit = 'xMidYMid slice' }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox={`0 0 800 ${500 + extend}`}
      preserveAspectRatio={fit}
      role="img"
      aria-label="Ilustrasi cerita"
    >
      <Background bg={scene.bg} ext={extend} />
      {scene.items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
      <Overlay bg={scene.bg} ext={extend} />
    </svg>
  );
}
