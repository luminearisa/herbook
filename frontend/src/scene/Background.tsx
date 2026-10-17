import type { Bg } from '../types';

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

function Sun({ low }: { low?: boolean }) {
  return (
    <g transform={`translate(${low ? 600 : 660} ${low ? 250 : 90})`}>
      <g className="rays">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="-3" y="-64" width="6" height="18" rx="3" fill="#ffd54a" transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r="38" fill="#ffd54a" />
      <circle r="30" fill="#ffe27a" />
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

export function Background({ bg }: { bg: Bg }) {
  const night = bg === 'malam';
  return (
    <g>
      <Sky bg={bg} />
      {(bg === 'hutan' || bg === 'sungai' || bg === 'kebun' || bg === 'desa' || bg === 'gurun') && <Sun />}
      {bg === 'senja' && <Sun low />}
      {bg === 'hutan' && (
        <>
          <Hills far="#9bd48b" mid="#7cc07a" y={280} />
          <ForestSilhouette y={320} color="#4f9e5a" />
          <Grass color="#68b258" from={360} />
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
          <path d="M150 300 L650 300 L700 500 L100 500z" fill="#3aa0d8" />
          <path d="M170 300 L630 300 L670 500 L130 500z" fill="#4db8ec" />
          <g className="ripples" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M230 330 q15 -8 30 0 t30 0" /><path d="M450 322 q15 -8 30 0 t30 0" />
            <path d="M300 450 q15 -8 30 0 t30 0" /><path d="M510 470 q15 -8 30 0 t30 0" />
            <path d="M200 400 q15 -8 30 0 t30 0" /><path d="M560 420 q15 -8 30 0 t30 0" />
          </g>
          <path d="M150 300 L170 300 L130 500 L100 500z M630 300 L650 300 L700 500 L670 500z" fill="#c9b27a" opacity=".7" />
        </>
      )}
    </g>
  );
}

/** Lapisan di atas objek: cahaya malam/senja, bulan, bintang, kunang-kunang. */
export function Overlay({ bg }: { bg: Bg }) {
  if (bg === 'salju') {
    return (
      <g fill="#fff">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} className="snow" style={{ animationDelay: `${(i % 9) * 0.5}s`, animationDuration: `${5 + (i % 5)}s` }} cx={(i * 97) % 800} cy={-10} r={2 + (i % 3)} />
        ))}
      </g>
    );
  }
  if (bg === 'senja') return <rect width="800" height="500" fill="#ff8a3d" opacity=".14" />;
  if (bg !== 'malam') return null;
  return (
    <g>
      <rect width="800" height="500" fill="#101e5c" opacity=".38" />
      {STARS.map(([x, y, r], i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} cx={x} cy={y} r={r} fill="#fff7c2" />
      ))}
      <g transform="translate(650 90)">
        <circle r="60" fill="#fff6c0" opacity=".16" />
        <circle r="40" fill="#fff6c0" opacity=".25" />
        <circle r="30" fill="#fff9d6" />
        <circle cx="-8" cy="-6" r="6" fill="#efe3a0" /><circle cx="10" cy="8" r="4" fill="#efe3a0" />
      </g>
      {[[200, 380], [330, 420], [560, 400], [700, 440]].map(([x, y], i) => (
        <circle key={i} className="firefly" style={{ animationDelay: `${i * 0.7}s` }} cx={x} cy={y} r="3" fill="#e9ff6b" />
      ))}
    </g>
  );
}
