import type { CharProps } from './characters';

export function Pohon({ v = 0 }: CharProps) {
  const fruit = v === 1;
  const snow = v === 3;
  const leaf = snow ? '#e9f2f8' : ['#3f9a4d', '#3b9145', '#58a948'][v % 3];
  return (
    <g>
      <path d="M-12 0 Q-8 -60 -6 -110 L8 -110 Q8 -60 14 0z" fill="#7a4e2a" />
      <path d="M-4 -60 L-26 -86 M4 -76 L26 -100" stroke="#7a4e2a" strokeWidth="7" strokeLinecap="round" />
      <g className="sway">
        <circle cx="0" cy="-150" r="52" fill={leaf} />
        <circle cx="-42" cy="-122" r="38" fill={leaf} />
        <circle cx="44" cy="-124" r="38" fill={leaf} />
        <circle cx="-14" cy="-168" r="34" fill="#fff" opacity=".1" />
        {fruit &&
          [[-30, -140], [24, -160], [40, -120], [-50, -112], [0, -118], [10, -184]].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="7" ry="8.5" fill={i % 2 ? '#ffc23a' : '#ff9a2e'} />
              <path d={`M${x} ${y - 8} q3 -5 6 -4`} stroke="#2f6e3a" strokeWidth="2" fill="none" />
            </g>
          ))}
      </g>
    </g>
  );
}

export function Semak({ v = 0 }: CharProps) {
  const c = v === 3 ? '#e9f2f8' : ['#4fa04a', '#3f8c47', '#62b04f'][v % 3];
  return (
    <g>
      <ellipse cx="0" cy="-18" rx="52" ry="24" fill={c} />
      <circle cx="-26" cy="-30" r="20" fill={c} />
      <circle cx="22" cy="-34" r="23" fill={c} />
      <circle cx="-10" cy="-42" r="16" fill="#fff" opacity=".1" />
    </g>
  );
}

export function Batu({ v = 0 }: CharProps) {
  const c = ['#9a9a9a', '#8a8f98', '#a39a8e', '#80868f'][v % 4];
  return (
    <g>
      <path d="M-38 0 Q-44 -26 -18 -34 Q6 -44 26 -30 Q44 -18 40 0z" fill={c} />
      <path d="M-18 -34 Q6 -44 26 -30 Q10 -30 -4 -22z" fill="#fff" opacity=".25" />
    </g>
  );
}

export function Bunga({ v = 0 }: CharProps) {
  const c = ['#ff6b8a', '#ffd23f', '#b57bee', '#ffffff'][v % 4];
  return (
    <g>
      <path d="M0 0 V-28" stroke="#3f8c47" strokeWidth="3" />
      <path d="M0 -10 q10 -6 14 -14" stroke="#3f8c47" strokeWidth="3" fill="none" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-37" rx="5" ry="8" fill={c} transform={`rotate(${a} 0 -30)`} />
      ))}
      <circle cx="0" cy="-30" r="4.5" fill="#f9a825" />
    </g>
  );
}

export function Awan({ v = 0 }: CharProps) {
  return (
    <g className={v % 2 ? 'drift-b' : 'drift'} opacity=".95">
      <ellipse cx="0" cy="0" rx="54" ry="18" fill="#fff" />
      <circle cx="-20" cy="-12" r="20" fill="#fff" />
      <circle cx="14" cy="-18" r="26" fill="#fff" />
      <circle cx="38" cy="-6" r="16" fill="#fff" />
    </g>
  );
}

export function Timun({ v = 0 }: CharProps) {
  return (
    <g>
      <ellipse cx="0" cy="-4" rx="62" ry="10" fill="#6b4a2b" opacity=".55" />
      {[-40, -10, 22, 46].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 0 q-10 -22 ${i % 2 ? 8 : -6} -40 q16 12 ${x < 0 ? 14 : 8} 40`} fill="#3f9a4d" />
          <path d={`M${x} -4 q20 -18 ${i % 2 ? 30 : -26} -6`} stroke="#2f7a3d" strokeWidth="3" fill="none" />
        </g>
      ))}
      {[[-26, -8, -14], [8, -6, 8], [34, -8, -6]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x="-6" y="-26" width="12" height="30" rx="6" fill="#7ec850" stroke="#4e8f2d" strokeWidth="1.5" />
          <path d="M-2 -20 v18 M3 -22 v18" stroke="#b7e08b" strokeWidth="1.5" />
        </g>
      ))}
      {v === 1 && <circle cx="0" cy="-30" r="3" fill="#ffd23f" />}
    </g>
  );
}

export function Orangorangan() {
  return (
    <g>
      <rect x="-3" y="-120" width="6" height="120" fill="#7a4e2a" />
      <rect x="-48" y="-90" width="96" height="6" rx="3" fill="#7a4e2a" />
      <path d="M-26 -92 L-34 -50 L34 -50 L26 -92 Z" fill="#e4572e" />
      <path d="M-34 -50 H34 V-44 H-34z" fill="#c43e1c" />
      <path d="M-48 -90 L-60 -66 L-44 -62z M48 -90 L60 -66 L44 -62z" fill="#e4572e" />
      <circle cx="0" cy="-112" r="16" fill="#f3d9a4" stroke="#a8802c" strokeWidth="1.5" />
      <path d="M-30 -118 Q0 -148 30 -118 Q0 -112 -30 -118z" fill="#e7c36b" stroke="#a8802c" strokeWidth="1.5" />
      <circle cx="-5" cy="-110" r="2" fill="#2b1a0f" /><circle cx="6" cy="-110" r="2" fill="#2b1a0f" />
      <path d="M-5 -102 H6" stroke="#2b1a0f" strokeWidth="1.6" />
      <path d="M-4 -4 q-10 4 -14 0 M4 -4 q10 4 14 0" stroke="#4a8a3a" strokeWidth="3" fill="none" />
    </g>
  );
}

export function Rumah() {
  return (
    <g>
      {[-60, -30, 30, 60].map((x) => (
        <rect key={x} x={x - 3} y="-30" width="6" height="30" fill="#6b4a2b" />
      ))}
      <rect x="-70" y="-110" width="140" height="82" rx="4" fill="#d9b27a" />
      <path d="M-70 -90 H70 M-70 -70 H70 M-70 -50 H70" stroke="#b98d55" strokeWidth="2" />
      <rect x="-14" y="-92" width="28" height="64" rx="3" fill="#7a4e2a" />
      <rect x="-54" y="-94" width="26" height="22" rx="3" fill="#ffe9a8" stroke="#7a4e2a" strokeWidth="3" />
      <rect x="28" y="-94" width="26" height="22" rx="3" fill="#ffe9a8" stroke="#7a4e2a" strokeWidth="3" />
      <path d="M-92 -104 L0 -178 L92 -104 Z" fill="#a8532e" />
      <path d="M-76 -112 L0 -170 M-50 -108 L0 -150 M-20 -106 L0 -126" stroke="#82391c" strokeWidth="2" opacity=".6" />
      <rect x="-70" y="-30" width="140" height="6" fill="#6b4a2b" />
    </g>
  );
}

export function Pagar({ v = 0 }: CharProps) {
  const c = v ? '#a8802c' : '#b98d55';
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={-120 + i * 30} y="-52" width="12" height="52" rx="4" fill={c} />
      ))}
      <rect x="-124" y="-40" width="256" height="7" fill="#8a6a3a" />
      <rect x="-124" y="-18" width="256" height="7" fill="#8a6a3a" />
    </g>
  );
}

/** Kurungan bambu; digambar setelah penghuninya. */
export function Kurungan() {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={-64 + i * 16} y="-150" width="7" height="150" rx="3" fill="#d4a95a" stroke="#8a6a3a" strokeWidth="1.2" />
      ))}
      <ellipse cx="0" cy="-150" rx="68" ry="14" fill="#c9994a" stroke="#8a6a3a" strokeWidth="2" />
      <ellipse cx="0" cy="-150" rx="50" ry="8" fill="#a8802c" opacity=".7" />
      <rect x="-70" y="-6" width="140" height="9" rx="4" fill="#8a6a3a" />
      <rect x="-70" y="-76" width="140" height="7" fill="#8a6a3a" opacity=".8" />
    </g>
  );
}

export function Kabah() {
  return (
    <g>
      <ellipse cx="8" cy="2" rx="150" ry="16" fill="#efe3c6" opacity=".9" />
      <path d="M-70 -120 H40 L78 -134 H-32z" fill="#3a3a44" />
      <path d="M40 -120 L78 -134 V-14 L40 0z" fill="#17171c" />
      <rect x="-70" y="-120" width="110" height="120" fill="#26262b" />
      <rect x="-70" y="-100" width="110" height="12" fill="#d9a93c" />
      <path d="M40 -100 L78 -112 V-100 L40 -88z" fill="#b8892a" />
      <rect x="-48" y="-72" width="30" height="58" rx="3" fill="#e5b84a" stroke="#a8802c" strokeWidth="2" />
      <path d="M-33 -72 V-14" stroke="#a8802c" strokeWidth="2" />
      <path d="M-70 -80 H40 M-70 -60 H40" stroke="#32323a" strokeWidth="2" />
    </g>
  );
}

export function Kurma() {
  return (
    <g>
      <path d="M-8 0 Q-16 -60 -2 -130 L10 -130 Q4 -60 12 0z" fill="#8a5a2b" />
      {[-10, -26, -42, -58].map((y, i) => (
        <path key={i} d={`M-8 ${y} h20`} stroke="#6a421e" strokeWidth="3" />
      ))}
      <g className="sway" style={{ transformOrigin: '2px -130px' }}>
        {[-70, -40, -12, 14, 42, 70].map((a) => (
          <path key={a} d="M2 -130 Q40 -170 78 -128 Q42 -150 2 -130z" fill="#3f9a4d" stroke="#2f7a3d" strokeWidth="1.5" transform={`rotate(${a} 2 -130)`} />
        ))}
        <circle cx="-6" cy="-128" r="5" fill="#a8532e" /><circle cx="8" cy="-124" r="5" fill="#a8532e" />
      </g>
    </g>
  );
}

export function Surat() {
  return (
    <g className="flutter">
      <rect x="-26" y="-14" width="52" height="28" rx="5" fill="#f3e2b3" stroke="#b58d45" strokeWidth="2" />
      <path d="M-18 -6 H18 M-18 0 H12 M-18 6 H16" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="-26" cy="0" rx="5" ry="15" fill="#e7cf92" stroke="#b58d45" strokeWidth="2" />
      <circle cx="16" cy="8" r="5" fill="#b3412e" />
    </g>
  );
}

export function Debu() {
  return (
    <g className="drift">
      {[[-60, -16, 24], [-26, -30, 30], [10, -20, 34], [48, -30, 26], [80, -14, 22], [-4, -48, 22]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#e0c08a" opacity=".78" />
      ))}
    </g>
  );
}

export function Sarang() {
  return (
    <g>
      <path d="M-60 0 Q-50 -50 -10 -58 Q30 -62 56 -20 Q62 -8 66 0z" fill="#9a6a3a" />
      <path d="M-40 -14 q8 -22 30 -30" stroke="#b98350" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".7" />
      <ellipse cx="6" cy="-6" rx="17" ry="12" fill="#3b2412" />
      {[[-48, -6], [-30, -2], [30, -4], [48, -2]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill="#7a5028" />
      ))}
    </g>
  );
}

export function Bendera() {
  return (
    <g>
      <rect x="-3" y="-120" width="6" height="120" rx="3" fill="#7a4e2a" />
      <g className="drift-b">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={3 + (i % 4) * 14} y={-118 + Math.floor(i / 4) * 14} width="14" height="14" fill={(i + Math.floor(i / 4)) % 2 ? '#2b1a0f' : '#fff'} />
        ))}
      </g>
      <path d="M-40 0 H40" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".8" />
    </g>
  );
}

/** Jaring pemburu; digambar setelah tokoh yang terperangkap. */
export function Jaring() {
  return (
    <g opacity=".92">
      <path d="M-90 0 Q-100 -90 -30 -170 H30 Q100 -90 90 0z" fill="#d9c08a" fillOpacity=".15" stroke="#9a7a3a" strokeWidth="3" />
      {[-60, -30, 0, 30, 60].map((x) => (
        <path key={x} d={`M${x} -170 L${x * 1.5} 0`} stroke="#9a7a3a" strokeWidth="2" />
      ))}
      {[-130, -90, -50, -16].map((y) => (
        <path key={y} d={`M-95 ${y} Q0 ${y + 14} 95 ${y}`} stroke="#9a7a3a" strokeWidth="2" fill="none" />
      ))}
    </g>
  );
}
