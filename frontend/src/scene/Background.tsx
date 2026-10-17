import { useRef, useState } from 'react';
import type { Bg } from '../types';
import { playSound } from '../sound';

const STARS: [number, number, number][] = [
  [70, 40, 2], [160, 90, 1.6], [260, 30, 2.2], [340, 110, 1.5], [430, 50, 2], [520, 130, 1.6],
  [600, 40, 2.2], [690, 100, 1.8], [760, 30, 1.6], [120, 160, 1.4], [470, 170, 1.6], [720, 170, 1.4],
];

const SKY: Record<Bg, [string, string]> = {
  hutan: ['#7fd0ff', '#f3fbd9'],
  sungai: ['#6ec6f5', '#eaf8e2'],
  kebun: ['#8fd6ff', '#fff6d2'],
  desa: ['#86d1fa', '#fdf1cf'],
  malam: ['#0a1640', '#2b3a80'],
  senja: ['#6a4c9c', '#ffb26b'],
  gurun: ['#7cc8f2', '#fff0c4'],
  salju: ['#b9d3ea', '#f3f8fc'],
  dalamrumah: ['#fbe9c8', '#fbe9c8'],
};

function Sky({ bg }: { bg: Bg }) {
  const [a, b] = SKY[bg];
  return (
    <>
      <defs>
        <linearGradient id={`sky-${bg}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#sky-${bg})`} />
    </>
  );
}

function Sun({ low, interactive, onInteract }: { low?: boolean; interactive?: boolean; onInteract?: () => void }) {
  const [fast, setFast] = useState(false);
  const timer = useRef<number>();
  function tap(e: React.MouseEvent) {
    e.stopPropagation(); // jangan ikut memicu efek sentuhan latar
    onInteract?.();
    playSound('chime');
    setFast(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFast(false), 1400);
  }
  return (
    <g
      transform={`translate(${low ? 600 : 660} ${low ? 250 : 90})`}
      className={interactive ? 'tappable' : undefined}
      onClick={interactive ? tap : undefined}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'matahari' : undefined}
    >
      <g className={fast ? 'rays rays-fast' : 'rays'}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="-3" y="-64" width="6" height="18" rx="3" fill="#ffd54a" transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r="38" fill="#ffd54a" className={fast ? 'sun-pulse' : undefined} />
      <circle r="30" fill="#ffe27a" className={fast ? 'sun-pulse' : undefined} />
    </g>
  );
}

function Hills({ far, mid, y = 280 }: { far: string; mid: string; y?: number }) {
  return (
    <>
      <path d={`M0 ${y} Q120 ${y - 90} 260 ${y - 20} T520 ${y - 30} T800 ${y - 50} V500 H0z`} fill={far} />
      <path d={`M0 ${y + 40} Q160 ${y - 30} 330 ${y + 20} T640 ${y + 10} T800 ${y - 10} V500 H0z`} fill={mid} />
    </>
  );
}

function Grass({ color, from }: { color: string; from: number }) {
  return (
    <>
      <rect y={from} width="800" height={500 - from} fill={color} />
      {[40, 150, 260, 390, 500, 620, 730].map((x, i) => (
        <path key={x} d={`M${x} ${from + 36 + (i % 3) * 22} l4 -14 l4 14 l4 -16 l4 16`} stroke="#fff" strokeOpacity=".25" strokeWidth="2" fill="none" />
      ))}
    </>
  );
}

function ForestSilhouette({ y, color }: { y: number; color: string }) {
  return (
    <g fill={color}>
      {[30, 130, 240, 350, 470, 580, 700].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={y - 20} width="10" height="40" />
          <circle cx={x} cy={y - 34 - (i % 2) * 10} r={34 + (i % 3) * 6} />
        </g>
      ))}
    </g>
  );
}

const GROUND: Record<Bg, string> = {
  hutan: '#68b258', sungai: '#68b258', kebun: '#8fbf5a', desa: '#78b85e', malam: '#2a6a46',
  senja: '#3f7a4d', gurun: '#f6dfa0', salju: '#f4f9fc', dalamrumah: '#c98f55',
};

/** `ext`: tambahan tinggi (unit viewBox) di bawah kanvas 800x500, dipakai mode layar penuh. */
export function Background({ bg, ext = 0, interactive = false, onInteract }: { bg: Bg; ext?: number; interactive?: boolean; onInteract?: () => void }) {
  const night = bg === 'malam';
  const b = 500 + ext;
  return (
    <g>
      <Sky bg={bg} />
      {ext > 0 && <rect y="480" width="800" height={ext + 20} fill={GROUND[bg]} />}
      {(bg === 'hutan' || bg === 'sungai' || bg === 'kebun' || bg === 'desa' || bg === 'gurun') && <Sun interactive={interactive} onInteract={onInteract} />}
      {bg === 'senja' && <Sun low interactive={interactive} onInteract={onInteract} />}
      {bg === 'hutan' && (
        <>
          <Hills far="#9bd48b" mid="#7cc07a" y={280} />
          <ForestSilhouette y={320} color="#4f9e5a" />
          <Grass color="#68b258" from={360} />
        </>
      )}
      {bg === 'dalamrumah' && (
        <>
          <rect y="300" width="800" height="14" fill="#e9d2a2" />
          <rect y="314" width="800" height="70" fill="#f3dfb4" />
          <rect y="384" width="800" height="116" fill="#c98f55" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${i * 110 - 20} 384 L${i * 140 - 160 + (30 * i - 140) * (ext / 116)} ${b}`} stroke="#a8713c" strokeWidth="3" />
          ))}
          <path d="M0 440 H800 M0 475 H800" stroke="#a8713c" strokeWidth="2" opacity=".7" />
          <rect x="560" y="70" width="170" height="150" rx="8" fill="#bfe4f5" stroke="#8a5a2b" strokeWidth="9" />
          <path d="M645 70 V220 M560 145 H730" stroke="#8a5a2b" strokeWidth="6" />
          <circle cx="690" cy="115" r="22" fill="#fff6c0" opacity=".85" />
          <path d="M548 62 Q572 120 556 228 L596 228 Q580 120 596 62z M742 62 Q718 120 734 228 L694 228 Q710 120 694 62z" fill="#e88aa0" opacity=".9" />
          <rect x="90" y="86" width="150" height="100" rx="8" fill="#fffaf0" stroke="#8a5a2b" strokeWidth="8" />
          <path d="M115 160 Q165 100 215 160z" fill="#8fd0a0" />
          <circle cx="190" cy="118" r="12" fill="#ffd54a" />
        </>
      )}
      {bg === 'salju' && (
        <>
          <Hills far="#e3eef7" mid="#d3e3f0" y={290} />
          <ForestSilhouette y={320} color="#c3d6e6" />
          <Grass color="#f4f9fc" from={360} />
        </>
      )}
      {bg === 'gurun' && (
        <>
          <path d="M0 300 Q150 240 300 290 T600 280 T800 270 V500 H0z" fill="#ecc977" />
          <path d="M0 350 Q200 290 400 340 T800 320 V500 H0z" fill="#f2d68f" />
          <rect y="400" width="800" height="100" fill="#f6dfa0" />
          {[[100, 440], [300, 470], [520, 430], [680, 475]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q30 -10 60 0`} stroke="#d9b567" strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}
        </>
      )}
      {bg === 'senja' && (
        <>
          <Hills far="#7a5aa0" mid="#4e7a56" y={300} />
          <Grass color="#3f7a4d" from={370} />
        </>
      )}
      {night && (
        <>
          <Hills far="#1d2c63" mid="#1f4a45" y={300} />
          <Grass color="#2a6a46" from={360} />
        </>
      )}
      {bg === 'kebun' && (
        <>
          <Hills far="#a8d98a" mid="#8ccb77" y={270} />
          <Grass color="#8fbf5a" from={340} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M0 ${400 + i * 26} Q400 ${390 + i * 26} 800 ${400 + i * 26}`} stroke="#6b4a2b" strokeOpacity=".28" strokeWidth="8" fill="none" />
          ))}
        </>
      )}
      {bg === 'desa' && (
        <>
          <Hills far="#a4d98c" mid="#86c474" y={290} />
          <Grass color="#78b85e" from={360} />
          <path d="M300 500 Q380 420 470 360 L520 360 Q430 430 400 500z" fill="#d9bd88" />
        </>
      )}
      {bg === 'sungai' && (
        <>
          <Hills far="#9bd48b" mid="#7cc07a" y={250} />
          <ForestSilhouette y={290} color="#4f9e5a" />
          <Grass color="#68b258" from={300} />
          {/* sungai: tepi kiri < 170, tepi kanan > 630 */}
          <path d={`M150 300 L650 300 L${700 + ext * 0.25} ${b} L${100 - ext * 0.25} ${b}z`} fill="#3aa0d8" />
          <path d={`M170 300 L630 300 L${670 + ext * 0.2} ${b} L${130 - ext * 0.2} ${b}z`} fill="#4db8ec" />
          <g className="ripples" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M230 330 q15 -8 30 0 t30 0" /><path d="M450 322 q15 -8 30 0 t30 0" />
            <path d="M300 450 q15 -8 30 0 t30 0" /><path d="M510 470 q15 -8 30 0 t30 0" />
            <path d="M200 400 q15 -8 30 0 t30 0" /><path d="M560 420 q15 -8 30 0 t30 0" />
          </g>
          <path d={`M150 300 L170 300 L${130 - ext * 0.2} ${b} L${100 - ext * 0.25} ${b}z M630 300 L650 300 L${700 + ext * 0.25} ${b} L${670 + ext * 0.2} ${b}z`} fill="#c9b27a" opacity=".7" />
        </>
      )}
    </g>
  );
}

/** Lapisan di atas objek: cahaya malam/senja, bulan, bintang, kunang-kunang. Tidak boleh menghalangi sentuhan ke tokoh. */
export function Overlay({ bg, ext = 0, interactive = false, onInteract }: { bg: Bg; ext?: number; interactive?: boolean; onInteract?: () => void }) {
  const [glow, setGlow] = useState(false);
  const timer = useRef<number>();
  if (bg === 'salju') {
    return (
      <g fill="#fff" pointerEvents="none">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} className="snow" style={{ animationDelay: `${(i % 9) * 0.5}s`, animationDuration: `${5 + (i % 5)}s` }} cx={(i * 97) % 800} cy={-10} r={2 + (i % 3)} />
        ))}
      </g>
    );
  }
  if (bg === 'senja') return <rect width="800" height={500 + ext} fill="#ff8a3d" opacity=".14" pointerEvents="none" />;
  if (bg !== 'malam') return null;
  function tapMoon() {
    onInteract?.();
    playSound('chime');
    setGlow(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setGlow(false), 1500);
  }
  return (
    <g>
      <g pointerEvents="none">
        <rect width="800" height={500 + ext} fill="#101e5c" opacity=".38" />
        {STARS.map(([x, y, r], i) => (
          <circle key={i} className={glow ? 'twinkle twinkle-fast' : 'twinkle'} style={{ animationDelay: `${i * 0.3}s` }} cx={x} cy={y} r={r} fill="#fff7c2" />
        ))}
        {[[200, 380], [330, 420], [560, 400], [700, 440]].map(([x, y], i) => (
          <circle key={i} className="firefly" style={{ animationDelay: `${i * 0.7}s` }} cx={x} cy={y} r="3" fill="#e9ff6b" />
        ))}
      </g>
      <g
        transform="translate(650 90)"
        className={interactive ? 'tappable' : undefined}
        onClick={interactive ? tapMoon : undefined}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? 'bulan' : undefined}
      >
        <circle r="60" fill="#fff6c0" opacity={glow ? 0.35 : 0.16} className={glow ? 'sun-pulse' : undefined} />
        <circle r="40" fill="#fff6c0" opacity=".25" />
        <circle r="30" fill="#fff9d6" />
        <circle cx="-8" cy="-6" r="6" fill="#efe3a0" /><circle cx="10" cy="8" r="4" fill="#efe3a0" />
      </g>
    </g>
  );
}
