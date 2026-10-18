import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { SceneData, SceneItem } from '../types';
import { Background, Overlay } from './Background';
import { interactionFor, nameFor, speechFor, type Fx, type Interaction } from './interactions';
import { playSound, speak } from '../sound';
import { Ababil, Anak, Anjing, Buaya, Burung, Dewasa, Gajah, Harimau, Belalang, Buah, Hudhud, Ikan, Kancil, Kelinci, Kupu, Kurakura, Lubang, Paus, Petani, Semut, Singa, Tikus, Unta, type CharProps } from './characters';
import { Api, Angin, Awan, Bahtera, Batu, Bendera, Bintang, Bulan, Bunga, Debu, Gua, Gunung, Hujan, Jaring, Kincir, Kue, Kursi, Layangan, Matahari, Pelangi, Petir, Meja, Ombak, Piramida, Vas, Kabah, Kurma, Kurungan, Orangorangan, Pagar, Pohon, Rumah, Sarang, Semak, Sumur, Surat, Tebing, Timun, Tongkat, Tunas } from './props';

const REGISTRY: Record<string, (p: CharProps) => ReactElement> = {
  kancil: Kancil, buaya: Buaya, harimau: Harimau, gajah: Gajah, petani: Petani, kurakura: Kurakura,
  burung: Burung, kupu: Kupu, pohon: Pohon, semak: Semak, batu: Batu, bunga: Bunga,
  awan: Awan, timun: Timun, orangorangan: Orangorangan, rumah: Rumah, kurungan: Kurungan, pagar: Pagar,
  kabah: Kabah, semut: Semut, hudhud: Hudhud, ababil: Ababil, kurma: Kurma, surat: Surat, debu: Debu, sarang: Sarang,
  kelinci: Kelinci, belalang: Belalang, singa: Singa, tikus: Tikus, bendera: Bendera, jaring: Jaring,
  anak: Anak, dewasa: Dewasa, meja: Meja, kursi: Kursi, tunas: Tunas, vas: Vas, kue: Kue, sumur: Sumur, tongkat: Tongkat, buah: Buah, lubang: Lubang,
  paus: Paus, bahtera: Bahtera, anjing: Anjing, gua: Gua, hujan: Hujan, ombak: Ombak, unta: Unta, tebing: Tebing, gunung: Gunung, api: Api, piramida: Piramida, ikan: Ikan,
  matahari: Matahari, bulan: Bulan, bintang: Bintang, pelangi: Pelangi, petir: Petir, layangan: Layangan, kincir: Kincir, angin: Angin,
};

// Hewan/orang yang bergerak halus supaya gambar terasa hidup.
const LIVELY = new Set(['kancil', 'buaya', 'harimau', 'gajah', 'petani', 'kurakura', 'semut', 'kelinci', 'singa', 'tikus', 'belalang', 'anak', 'dewasa', 'buah', 'paus', 'anjing', 'unta', 'ikan']);

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Partikel sesaat: daun/buah jatuh, tetes hujan, kilau, percikan air. */
function Particles({ kinds, box, ground }: { kinds: Fx[]; box: [number, number, number, number]; ground: number }) {
  const [x0, y0, w, h] = box;
  const parts = useRef(
    kinds.flatMap((kind) => {
      const n = kind === 'fruit' ? 2 : kind === 'sparkle' ? 5 : kind === 'rain' ? 9 : kind === 'flash' ? 1 : 7;
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
      {parts.map((p, i) => p.kind === 'flash' ? (
        <rect key={i} className="fx-flash" x={-2400} y={-2400} width={4800} height={4800} fill="#fff" />
      ) : (
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

function Item({ item, interactive, onInteract, showNames, lang = 'id' }: { item: SceneItem; interactive: boolean; onInteract?: () => void; showNames?: boolean; lang?: 'id' | 'en' }) {
  const Comp = REGISTRY[item.t];
  const cfg: Interaction | undefined = interactive ? interactionFor(item) : undefined;
  const [run, setRun] = useState<{ n: number; cfg: Interaction } | null>(null);
  const timer = useRef<number>();
  const inner = useRef<SVGGElement>(null);
  const [tag, setTag] = useState<{ x: number; y: number; text: string } | null>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!Comp) return null;

  const s = item.s ?? 1;
  const bob = LIVELY.has(item.t) && item.pose !== 'rebah' && item.pose !== 'tidur';
  const slow = item.t === 'buaya' ? 'bob slow' : 'bob';

  function tap() {
    if (!cfg) return;
    onInteract?.();
    const voice = lang === 'en' ? 'en-US' : 'id-ID';
    const name = showNames ? nameFor(item, lang) : undefined;
    if (name) {
      // Halaman belajar: bunyi efek, lalu nama benda diucapkan dan ditampilkan
      if (cfg.sound) playSound(cfg.sound);
      window.setTimeout(() => speak(name, '', voice), 350);
      const bb = inner.current?.getBBox();
      if (bb) {
        // jaga label tetap di dalam gambar (tidak terpotong di tepi atas)
        const minY = (46 - item.y) / s;
        setTag({ x: bb.x + bb.width / 2, y: Math.max(bb.y - 14, minY), text: name });
      }
    } else if (cfg.speak) speak(speechFor(item, cfg, lang) ?? '', cfg.sound ?? 'boing', voice);
    else if (cfg.sound) playSound(cfg.sound);
    setRun((r) => ({ n: (r?.n ?? 0) + 1, cfg }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setRun(null); setTag(null); }, showNames ? 2600 : 1800);
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
          <g ref={inner} className={bob ? slow : undefined}>
            <Comp pose={pose} mood={mood} v={item.v} />
          </g>
        </g>
        {tag && (
          <g transform={`translate(${tag.x} ${tag.y}) scale(${(item.flip ? -1 : 1) / s} ${1 / s})`} pointerEvents="none">
            <g className="name-tag">
              <rect x={-(tag.text.length * 8.5 + 16)} y="-30" width={tag.text.length * 17 + 32} height="40" rx="20" fill="#fffdf6" stroke="#2f6b4f" strokeWidth="3" />
              <text y="-4" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="24" fill="#1f4a36">{tag.text}</text>
            </g>
          </g>
        )}
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
  /** Halaman belajar: tampilkan dan ucapkan nama benda saat disentuh. */
  showNames?: boolean;
  /** Bahasa nama benda yang diucapkan pada halaman belajar. */
  lang?: 'id' | 'en';
}

interface Tap { id: number; x: number; y: number; kind: 'ring' | 'sparkle' | 'puff' }

/** Letak sentuhan di koordinat gambar; di sungai berupa riak air. */
function tapKind(bg: SceneData['bg'], x: number, y: number): { kind: Tap['kind']; sound: string } {
  const inWater = bg === 'sungai' && y > 300 && x > 150 - 0.25 * (y - 300) && x < 650 + 0.25 * (y - 300);
  if (inWater) return { kind: 'ring', sound: 'splash' };
  if (y < 300 && bg !== 'dalamrumah') return { kind: 'sparkle', sound: 'chime' };
  return { kind: 'puff', sound: 'pop' };
}

export function Scene({ scene, className, extend = 0, fit = 'xMidYMid slice', interactive = false, onInteract, showNames = false, lang = 'id' }: SceneProps) {
  const [taps, setTaps] = useState<Tap[]>([]);
  const nextId = useRef(0);

  function tapBackground(e: React.MouseEvent<SVGGElement>) {
    const svg = e.currentTarget.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    const { kind, sound } = tapKind(scene.bg, p.x, p.y);
    onInteract?.();
    playSound(sound);
    const id = nextId.current++;
    setTaps((t) => [...t.slice(-6), { id, x: p.x, y: p.y, kind }]);
    window.setTimeout(() => setTaps((t) => t.filter((x) => x.id !== id)), 1300);
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 800 ${500 + extend}`}
      preserveAspectRatio={fit}
      role="img"
      aria-label="Ilustrasi cerita"
    >
      <g onClick={interactive ? tapBackground : undefined}>
        <Background bg={scene.bg} ext={extend} interactive={interactive} onInteract={onInteract} />
      </g>
      {scene.items.map((item, i) => (
        <Item key={i} item={item} interactive={interactive} onInteract={onInteract} showNames={showNames} lang={lang} />
      ))}
      <Overlay bg={scene.bg} ext={extend} interactive={interactive} onInteract={onInteract} />
      <g pointerEvents="none">
        {taps.map((t) => (
          <g key={t.id} transform={`translate(${t.x} ${t.y})`}>
            {t.kind === 'ring' && [0, 1, 2].map((i) => <circle key={i} className="fx-ring" style={{ animationDelay: `${i * 0.15}s` }} r="22" fill="none" stroke="#fff" strokeWidth="3" />)}
            {t.kind === 'sparkle' && [[-18, -6], [0, -22], [18, -4], [0, 8]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}><path className="fx fx-sparkle" style={{ ['--dx' as string]: `${x}px`, animationDelay: `${i * 0.06}s` }} d="M0 -9 L2.7 -2.7 L9 0 L2.7 2.7 L0 9 L-2.7 2.7 L-9 0 L-2.7 -2.7z" fill="#ffd54a" /></g>
            ))}
            {t.kind === 'puff' && [[-14, 0], [0, -6], [14, 0]].map(([x, y], i) => (
              <circle key={i} className="fx-puff" style={{ animationDelay: `${i * 0.05}s` }} cx={x} cy={y} r="9" fill="#fff" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
