import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { SceneData, SceneItem } from '../types';
import { Background, Overlay } from './Background';
import { interactionFor, type Fx, type Interaction } from './interactions';
import { playSound, speak } from '../sound';
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

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Partikel sesaat: daun/buah jatuh, tetes hujan, kilau, percikan air. */
function Particles({ kinds, box, ground }: { kinds: Fx[]; box: [number, number, number, number]; ground: number }) {
  const [x0, y0, w, h] = box;
  const parts = useRef(
    kinds.flatMap((kind) => {
      const n = kind === 'fruit' ? 2 : kind === 'sparkle' ? 5 : kind === 'rain' ? 9 : 7;
      return Array.from({ length: n }, (_, i) => ({
        kind,
        x: x0 + rand(0, w),
        y: y0 + rand(0, h),
        dx: rand(-30, 30),
        r: rand(-200, 200),
        delay: i * 0.08 + rand(0, 0.2),
      }));
    }),
  ).current;
  return (
    <g pointerEvents="none">
      {parts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <g
            className={`fx fx-${p.kind}`}
            style={{ ['--dx' as string]: `${p.dx}px`, ['--dy' as string]: `${Math.max(30, p.kind === 'rain' ? ground - 20 : ground - p.y)}px`, ['--r' as string]: `${p.r}deg`, animationDelay: `${p.delay}s` }}
          >
            {p.kind === 'leaves' && <path transform="scale(1.6)" d="M0 0 Q7 -9 14 0 Q7 9 0 0z" fill={i % 2 ? '#58a948' : '#3f9a4d'} />}
            {p.kind === 'fruit' && <circle r="8" fill="#ff9a2e" />}
            {p.kind === 'rain' && <path transform="scale(1.6)" d="M0 0 q-3 8 0 11 q3 -3 0 -11z" fill="#4db8ec" />}
            {p.kind === 'sparkle' && <path d="M0 -8 L2.4 -2.4 L8 0 L2.4 2.4 L0 8 L-2.4 2.4 L-8 0 L-2.4 -2.4z" fill="#ffd54a" />}
            {p.kind === 'splash' && <circle r="3.5" fill="#6ec6f5" />}
          </g>
        </g>
      ))}
    </g>
  );
}

function Item({ item, interactive, onInteract }: { item: SceneItem; interactive: boolean; onInteract?: () => void }) {
  const Comp = REGISTRY[item.t];
  const cfg: Interaction | undefined = interactive ? interactionFor(item) : undefined;
  const [run, setRun] = useState<{ n: number; cfg: Interaction } | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!Comp) return null;

  const s = item.s ?? 1;
  const bob = LIVELY.has(item.t) && item.pose !== 'rebah' && item.pose !== 'tidur';
  const slow = item.t === 'buaya' ? 'bob slow' : 'bob';

  function tap() {
    if (!cfg) return;
    onInteract?.();
    if (cfg.speak) speak(cfg.speak[Math.floor(Math.random() * cfg.speak.length)], cfg.sound ?? 'boing');
    else if (cfg.sound) playSound(cfg.sound);
    setRun((r) => ({ n: (r?.n ?? 0) + 1, cfg }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRun(null), 1800);
  }

  const active = run?.cfg;
  const mood = active?.mood && item.pose !== 'tidur' && item.pose !== 'rebah' ? active.mood : item.mood;
  const pose = active?.pose && (!item.pose || item.pose === 'berdiri') ? active.pose : item.pose;

  return (
    <g transform={`translate(${item.x} ${item.y}) scale(${item.flip ? -s : s} ${s})`}>
      <g
        className={cfg ? 'tappable' : undefined}
        onClick={cfg ? tap : undefined}
        onKeyDown={cfg ? (e) => (e.key === 'Enter' || e.key === ' ') && tap() : undefined}
        role={cfg ? 'button' : undefined}
        tabIndex={cfg ? 0 : undefined}
        aria-label={cfg ? item.t : undefined}
      >
        <g
          key={run?.n ?? 0}
          className={active ? `react react-${active.anim} origin-${active.origin ?? 'bottom'}` : undefined}
        >
          <g className={bob ? slow : undefined}>
            <Comp pose={pose} mood={mood} v={item.v} />
          </g>
        </g>
        {run && active?.fx && active.fxBox && (
          <Particles key={run.n} kinds={active.fx} box={active.fxBox} ground={-0 + Math.max(40, (470 - item.y) / s + 0)} />
        )}
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
  /** Gambar bisa disentuh: tokoh dan benda bergerak serta berbunyi. */
  interactive?: boolean;
  onInteract?: () => void;
}

export function Scene({ scene, className, extend = 0, fit = 'xMidYMid slice', interactive = false, onInteract }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox={`0 0 800 ${500 + extend}`}
      preserveAspectRatio={fit}
      role="img"
      aria-label="Ilustrasi cerita"
    >
      <Background bg={scene.bg} ext={extend} interactive={interactive} onInteract={onInteract} />
      {scene.items.map((item, i) => (
        <Item key={i} item={item} interactive={interactive} onInteract={onInteract} />
      ))}
      <Overlay bg={scene.bg} ext={extend} />
    </svg>
  );
}
