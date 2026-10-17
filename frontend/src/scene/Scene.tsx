import type { ReactElement } from 'react';
import type { SceneData, SceneItem } from '../types';
import { Background, Overlay } from './Background';
import { Buaya, Burung, Gajah, Harimau, Kancil, Kupu, Kurakura, Petani, type CharProps } from './characters';
import { Awan, Batu, Bunga, Kurungan, Orangorangan, Pagar, Pohon, Rumah, Semak, Timun } from './props';

const REGISTRY: Record<string, (p: CharProps) => ReactElement> = {
  kancil: Kancil, buaya: Buaya, harimau: Harimau, gajah: Gajah, petani: Petani, kurakura: Kurakura,
  burung: Burung, kupu: Kupu, pohon: Pohon, semak: Semak, batu: Batu, bunga: Bunga,
  awan: Awan, timun: Timun, orangorangan: Orangorangan, rumah: Rumah, kurungan: Kurungan, pagar: Pagar,
};

// Hewan/orang yang bergerak halus supaya gambar terasa hidup.
const LIVELY = new Set(['kancil', 'buaya', 'harimau', 'gajah', 'petani', 'kurakura']);

function Item({ item }: { item: SceneItem }) {
  const Comp = REGISTRY[item.t];
  if (!Comp) return null;
  const s = item.s ?? 1;
  const bob = LIVELY.has(item.t) && item.pose !== 'rebah';
  const slow = item.t === 'buaya' ? 'bob slow' : 'bob';
  return (
    <g transform={`translate(${item.x} ${item.y}) scale(${item.flip ? -s : s} ${s})`}>
      <g className={bob ? slow : undefined}>
        <Comp pose={item.pose} mood={item.mood} v={item.v} />
      </g>
    </g>
  );
}

export function Scene({ scene, className }: { scene: SceneData; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Ilustrasi cerita"
    >
      <Background bg={scene.bg} />
      {scene.items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
      <Overlay bg={scene.bg} />
    </svg>
  );
}
