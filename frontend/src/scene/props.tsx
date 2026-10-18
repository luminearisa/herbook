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
  const c = v >= 2 ? '#707c8c' : '#fff'; // v=2,3: awan mendung
  return (
    <g className={v % 2 ? 'drift-b' : 'drift'} opacity=".96">
      <ellipse cx="0" cy="0" rx="54" ry="18" fill={c} />
      <circle cx="-20" cy="-12" r="20" fill={c} />
      <circle cx="14" cy="-18" r="26" fill={c} />
      <circle cx="38" cy="-6" r="16" fill={c} />
      {v >= 2 && <ellipse cx="4" cy="6" rx="46" ry="9" fill="#5a6676" opacity=".6" />}
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

export function Meja({ v = 0 }: CharProps) {
  return (
    <g>
      {[-80, 70].map((x) => <rect key={x} x={x} y="-52" width="12" height="52" rx="3" fill="#8a5a2b" />)}
      <rect x="-100" y="-62" width="200" height="12" rx="5" fill="#b9833f" />
      <rect x="-100" y="-52" width="200" height="22" fill="#e8efe0" opacity=".9" />
      <path d="M-100 -52 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0 q10 12 20 0" fill="#e8efe0" />
      {v === 0 && (
        <>
          <ellipse cx="-34" cy="-66" rx="30" ry="7" fill="#fff" stroke="#c9c2ae" />
          <path d="M-52 -68 Q-34 -92 -16 -68z" fill="#fffdf4" stroke="#e5ddc4" />
          <circle cx="-20" cy="-70" r="6" fill="#d9603a" /><circle cx="-46" cy="-70" r="5" fill="#6aa84f" />
          <rect x="30" y="-90" width="18" height="28" rx="4" fill="#bfe4f5" opacity=".85" stroke="#7fb8d8" />
          <ellipse cx="72" cy="-66" rx="20" ry="5" fill="#fff" stroke="#c9c2ae" />
          <circle cx="66" cy="-70" r="5" fill="#f2b134" /><circle cx="78" cy="-70" r="5" fill="#d9603a" />
        </>
      )}
      {v === 1 && (
        <>
          <ellipse cx="-34" cy="-66" rx="30" ry="7" fill="#fff" stroke="#c9c2ae" />
          <ellipse cx="-34" cy="-66" rx="20" ry="4" fill="#f4f1e6" />
          <ellipse cx="70" cy="-66" rx="20" ry="5" fill="#fff" stroke="#c9c2ae" />
          <rect x="30" y="-90" width="18" height="28" rx="4" fill="#bfe4f5" opacity=".85" stroke="#7fb8d8" />
        </>
      )}
      {v === 2 && (
        <>
          <ellipse cx="-34" cy="-66" rx="30" ry="7" fill="#fff" stroke="#c9c2ae" />
          {[[-52, -67], [-42, -65], [-26, -67], [-14, -65], [-30, -69]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#fffdf4" stroke="#d9d0b4" />)}
          <path d="M-60 -66 q8 -8 16 -2" stroke="#d9603a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="70" cy="-66" rx="20" ry="5" fill="#fff" stroke="#c9c2ae" />
          <circle cx="62" cy="-68" r="3" fill="#fffdf4" /><circle cx="76" cy="-67" r="3" fill="#fffdf4" />
        </>
      )}
    </g>
  );
}

export function Vas({ v = 0 }: CharProps) {
  if (v === 1) {
    return (
      <g>
        <path d="M-34 0 L-22 -18 L-10 0z M2 0 L14 -24 L26 -4 L32 0z M-18 -6 L-4 -26 L6 -8z" fill="#4a8fd0" stroke="#2f6aa0" strokeWidth="1.5" />
        <path d="M-40 -2 q6 -10 12 -2 M20 -2 q8 -8 14 0" stroke="#e86a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="-44" cy="-6" r="4" fill="#e86a8a" /><circle cx="40" cy="-8" r="4" fill="#ffd23f" />
        <path d="M-6 -34 l4 8 M10 -36 l-4 10" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <path d="M-18 0 Q-34 -30 -12 -56 L-8 -66 H8 L12 -56 Q34 -30 18 0z" fill="#4a8fd0" stroke="#2f6aa0" strokeWidth="2" />
      <path d="M-14 -34 Q0 -26 14 -34" stroke="#fff" strokeOpacity=".6" strokeWidth="3" fill="none" />
      <path d="M0 -66 Q-10 -90 -20 -94 M0 -66 Q6 -96 10 -102 M0 -66 Q14 -84 24 -86" stroke="#3f9a4d" strokeWidth="3" fill="none" />
      <circle cx="-20" cy="-96" r="7" fill="#e86a8a" /><circle cx="10" cy="-104" r="7" fill="#ffd23f" /><circle cx="25" cy="-88" r="6" fill="#e86a8a" />
    </g>
  );
}

export function Kue() {
  return (
    <g>
      <ellipse cx="0" cy="-2" rx="52" ry="9" fill="#c9c2ae" />
      <ellipse cx="0" cy="-8" rx="48" ry="9" fill="#fffdf4" stroke="#d9d0b4" />
      {[[-26, '#f2b134'], [0, '#d9603a'], [26, '#8a5a2b']].map(([x, c]) => (
        <g key={x as number}>
          <path d={`M${(x as number) - 14} -10 Q${x} -34 ${(x as number) + 14} -10z`} fill={c as string} />
          <circle cx={x as number} cy="-26" r="3" fill="#fff" opacity=".8" />
        </g>
      ))}
    </g>
  );
}

export function Sumur({ v = 0 }: CharProps) {
  return (
    <g>
      <rect x="-56" y="-100" width="8" height="100" rx="3" fill="#7a4e2a" />
      <rect x="48" y="-100" width="8" height="100" rx="3" fill="#7a4e2a" />
      <path d="M-66 -96 L0 -134 L66 -96z" fill="#a8532e" />
      <path d="M0 -104 V-70" stroke="#9a7a3a" strokeWidth="3" />
      <path d="M-9 -70 h18 l-3 16 h-12z" fill="#8a5a2b" />
      <path d="M-52 -50 V0 H52 V-50z" fill="#b8b2a6" />
      <path d="M-52 -30 H52 M-52 -14 H52 M-20 -50 V-30 M20 -30 V-14 M-30 -14 V0 M30 -14 V0" stroke="#8f897d" strokeWidth="2" />
      <ellipse cx="0" cy="-50" rx="52" ry="14" fill="#cfc9bc" />
      <ellipse cx="0" cy="-50" rx="40" ry="9" fill="#2f5f8a" />
      {v === 1 && (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={Math.cos((i * Math.PI) / 4) * 8} cy={-50 + Math.sin((i * Math.PI) / 4) * 4} r="3.4" fill="#8a4f1f" />
          ))}
          <ellipse cx="0" cy="-50" rx="6" ry="3.4" fill="#e8b45a" />
          <circle cx="-2" cy="-51" r=".9" fill="#2b1a0f" /><circle cx="3" cy="-51" r=".9" fill="#2b1a0f" />
        </g>
      )}
    </g>
  );
}

export function Tongkat({ v = 0 }: CharProps) {
  if (v === 1) {
    return (
      <g>
        <rect x="-5" y="-176" width="10" height="176" rx="5" fill="#8a5a2b" />
        <path d="M0 -176 Q0 -204 -24 -202 Q-40 -198 -36 -182" stroke="#8a5a2b" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M-2 -150 V-120 M2 -90 V-60" stroke="#6a421e" strokeWidth="2" />
      </g>
    );
  }
  return (
    <g>
      <rect x="-90" y="-4" width="180" height="8" rx="4" fill="#8a5a2b" />
      <path d="M-60 -3 H-30 M20 2 H60" stroke="#6a421e" strokeWidth="1.6" />
    </g>
  );
}

export function Bahtera() {
  return (
    <g>
      <path d="M-160 -44 L160 -44 Q140 12 96 12 L-96 12 Q-140 12 -160 -44Z" fill="#8a5a2b" stroke="#5a3a1c" strokeWidth="3" />
      <path d="M-150 -26 H150 M-140 -10 H140" stroke="#6a421e" strokeWidth="3" />
      <rect x="-84" y="-114" width="168" height="72" rx="6" fill="#b9833f" stroke="#7a4e2a" strokeWidth="3" />
      <path d="M-104 -112 L0 -170 L104 -112z" fill="#a8532e" stroke="#7a3a1c" strokeWidth="3" />
      <circle cx="-40" cy="-80" r="12" fill="#ffe9a8" stroke="#7a4e2a" strokeWidth="3" />
      <circle cx="40" cy="-80" r="12" fill="#ffe9a8" stroke="#7a4e2a" strokeWidth="3" />
      <rect x="-12" y="-96" width="24" height="54" rx="3" fill="#7a4e2a" />
      <path d="M-150 -44 V-62 M-110 -44 V-62 M110 -44 V-62 M150 -44 V-62 M-150 -62 H-90 M90 -62 H150" stroke="#6a421e" strokeWidth="4" />
    </g>
  );
}

export function Gua() {
  return (
    <g>
      <path d="M-170 0 Q-160 -150 -44 -192 Q62 -214 134 -152 Q182 -104 176 0Z" fill="#8c8579" stroke="#6f695f" strokeWidth="3" />
      <path d="M-120 -90 Q-80 -150 -20 -170 M60 -184 Q120 -160 150 -110" stroke="#a69f92" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M-64 0 Q-64 -92 8 -104 Q84 -92 84 0Z" fill="#1d1a18" />
      <path d="M-50 0 Q-50 -80 8 -90 Q70 -80 70 0Z" fill="#2d2825" />
      <ellipse cx="-110" cy="-8" rx="34" ry="14" fill="#5fae55" /><ellipse cx="120" cy="-8" rx="38" ry="15" fill="#5fae55" />
      <ellipse cx="-30" cy="-176" rx="30" ry="12" fill="#6fbf5f" opacity=".85" /><ellipse cx="86" cy="-150" rx="26" ry="10" fill="#6fbf5f" opacity=".85" />
    </g>
  );
}

/** Hujan deras satu layar; letakkan di x=0, y=0. Tidak menerima sentuhan. */
export function Hujan() {
  return (
    <g pointerEvents="none">
      {Array.from({ length: 46 }, (_, i) => {
        const x = (i * 53) % 840;
        return (
          <path key={i} className="rain-line" style={{ animationDelay: `${(i % 9) * 0.11}s`, animationDuration: `${0.7 + (i % 4) * 0.12}s` }} d={`M${x} -40 l-8 26`} stroke="#d6efff" strokeOpacity=".8" strokeWidth="2.4" strokeLinecap="round" />
        );
      })}
      <rect width="800" height="500" fill="#1d3a5c" opacity=".16" />
    </g>
  );
}

/** Pita ombak di depan; letakkan di x=400. Tidak menerima sentuhan. */
export function Ombak() {
  return (
    <g pointerEvents="none" className="drift-b">
      <path d="M-520 0 q40 -22 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V120 H-520z" fill="#2f8fc8" opacity=".92" />
      <path d="M-520 0 q40 -22 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="4" />
    </g>
  );
}

export function Tebing() {
  return (
    <g>
      <path d="M-196 0 L-196 -120 Q-176 -196 -96 -206 Q-22 -236 60 -206 Q152 -194 184 -112 L196 0Z" fill="#b89a6e" stroke="#8f7650" strokeWidth="3" />
      <path d="M-190 -60 Q0 -76 190 -56 M-186 -110 Q0 -128 184 -104 M-150 -160 Q0 -184 150 -158" stroke="#a3855b" strokeWidth="4" fill="none" opacity=".8" />
      {[-110, -10, 96].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 30} 0 V${-58 - i * 8} Q${x - 30} ${-96 - i * 8} ${x} ${-96 - i * 8} Q${x + 30} ${-96 - i * 8} ${x + 30} ${-58 - i * 8} V0z`} fill="#2d2418" />
          <path d={`M${x - 36} 0 h72 M${x - 30} -6 h60`} stroke="#8f7650" strokeWidth="4" />
        </g>
      ))}
      <rect x="-60" y="-168" width="22" height="34" rx="10" fill="#2d2418" /><rect x="40" y="-166" width="22" height="34" rx="10" fill="#2d2418" />
    </g>
  );
}

/** Gunung: v 0 berpuncak salju, v 1 lebih hijau, v 2 berbatu tanpa salju. */
export function Gunung({ v = 0 }: CharProps) {
  const rock = ['#8d94a3', '#7f9781', '#9aa0ad'][v % 3];
  const dark = ['#6f768a', '#617a63', '#7c828f'][v % 3];
  const snow = '#f2f7fc';
  return (
    <g>
      <path d="M-220 0 L0 -280 L220 0 Z" fill={rock} />
      <path d="M0 -280 L220 0 L40 0 Z" fill={dark} />
      {v !== 2 && (
        <path d="M-66 -196 L0 -280 L66 -196 Q33 -216 0 -204 Q-33 -216 -66 -196 Z" fill={snow} />
      )}
      <path d="M-24 -236 Q-10 -170 -8 -110 M24 -236 Q12 -176 10 -110" stroke="#ffffff" strokeOpacity=".2" strokeWidth="6" fill="none" />
    </g>
  );
}

export function Api({ v = 0 }: CharProps) {
  if (v === 1) {
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="64" ry="10" fill="#6fbf5f" />
        <g className="flame" style={{ transformOrigin: '50% 100%' }} opacity=".75">
          <path d="M0 -4 C-30 -30 -26 -62 -8 -84 C-6 -62 4 -56 10 -70 C26 -50 30 -20 0 -4Z" fill="#9ee3ff" />
          <path d="M0 -6 C-14 -22 -12 -40 0 -52 C10 -40 14 -22 0 -6Z" fill="#e6fbff" />
        </g>
        {[[-52, -10, '#ff6b8a'], [-34, -6, '#ffd23f'], [38, -8, '#b57bee'], [56, -12, '#ff6b8a'], [20, -4, '#fff']].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0 0 V-14" stroke="#3f8c47" strokeWidth="3" />
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-20" rx="3.6" ry="6" fill={c as string} transform={`rotate(${a} 0 -15)`} />)}
            <circle cx="0" cy="-15" r="3" fill="#f9a825" />
          </g>
        ))}
        <g className="drift" opacity=".5"><circle cx="-14" cy="-96" r="9" fill="#fff" /><circle cx="6" cy="-108" r="12" fill="#fff" /><circle cx="26" cy="-98" r="8" fill="#fff" /></g>
      </g>
    );
  }
  return (
    <g>
      <rect x="-60" y="-14" width="120" height="16" rx="7" fill="#6a421e" transform="rotate(-6 0 -6)" />
      <rect x="-56" y="-18" width="112" height="16" rx="7" fill="#7a4e2a" transform="rotate(8 0 -10)" />
      <g className="flame" style={{ transformOrigin: '50% 100%' }}>
        <path d="M0 -10 C-60 -36 -56 -100 -20 -150 C-14 -110 10 -96 20 -124 C56 -88 66 -40 0 -10Z" fill="#ff6a1a" />
      </g>
      <g className="flame flame2" style={{ transformOrigin: '50% 100%' }}>
        <path d="M0 -10 C-36 -30 -34 -70 -12 -104 C-8 -78 8 -70 14 -88 C38 -64 40 -30 0 -10Z" fill="#ffb02e" />
      </g>
      <g className="flame flame3" style={{ transformOrigin: '50% 100%' }}>
        <path d="M0 -10 C-18 -22 -16 -42 0 -60 C16 -42 18 -22 0 -10Z" fill="#fff0a8" />
      </g>
    </g>
  );
}

export function Piramida() {
  return (
    <g>
      <path d="M-110 0 L0 -150 L110 0Z" fill="#e8c27a" stroke="#c9a257" strokeWidth="3" />
      <path d="M0 -150 L110 0 L34 0Z" fill="#cfa55c" />
      <path d="M-84 -34 H84 M-62 -64 H62 M-40 -94 H40 M-20 -122 H20" stroke="#c9a257" strokeWidth="2.4" opacity=".8" />
    </g>
  );
}

/* ---------------- Benda langit dan cuaca ---------------- */

export function Matahari() {
  return (
    <g>
      <circle r="120" fill="#ffe27a" opacity=".16" />
      <circle r="92" fill="#ffe27a" opacity=".22" />
      <g className="rays">
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x="-4" y={i % 2 ? -82 : -92} width="8" height={i % 2 ? 22 : 34} rx="4" fill="#ffc83d" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <circle r="52" fill="#ffc83d" />
      <circle r="44" fill="#ffdd57" />
      <ellipse cx="-14" cy="-16" rx="16" ry="9" fill="#fff" opacity=".35" transform="rotate(-30 -14 -16)" />
    </g>
  );
}

export function Bulan({ v = 0 }: CharProps) {
  return (
    <g>
      <circle r="84" fill="#fff6c0" opacity=".12" />
      <circle r="62" fill="#fff6c0" opacity=".2" />
      {v === 1 ? (
        <g>
          <path d="M6 -48 A48 48 0 1 0 6 48 A36 36 0 1 1 6 -48Z" fill="#fff9d6" />
          <circle cx="-22" cy="-6" r="5" fill="#efe3a0" /><circle cx="-14" cy="22" r="3.5" fill="#efe3a0" />
        </g>
      ) : v === 2 ? (
        <g>
          <path d="M0 -48 A48 48 0 0 0 0 48Z" fill="#fff9d6" />
          <path d="M0 -48 A48 48 0 0 1 0 48Z" fill="#fff6c0" opacity=".12" />
          <circle cx="-20" cy="-12" r="6" fill="#efe3a0" /><circle cx="-12" cy="22" r="4" fill="#efe3a0" />
        </g>
      ) : (
        <g>
          <circle r="48" fill="#fff9d6" />
          <circle cx="-16" cy="-12" r="9" fill="#efe3a0" /><circle cx="18" cy="10" r="12" fill="#efe3a0" /><circle cx="-6" cy="28" r="5" fill="#efe3a0" /><circle cx="22" cy="-26" r="5" fill="#efe3a0" />
        </g>
      )}
    </g>
  );
}

export function Bintang({ v = 0 }: CharProps) {
  const col = ['#fff3a0', '#ffe27a', '#d9ecff', '#ffd1e8'][v % 4];
  return (
    <g className="twinkle" style={{ animationDelay: `${(v % 4) * 0.4}s` }}>
      <circle r="26" fill={col} opacity=".18" />
      <path d="M0 -24 L6.5 -8 L24 -7 L10.5 4 L15 21 L0 11.5 L-15 21 L-10.5 4 L-24 -7 L-6.5 -8z" fill={col} />
    </g>
  );
}

const RAINBOW = ['#ee3b3b', '#ff9a1f', '#ffd21f', '#4cbf4c', '#2f8fe8', '#4a4fc9', '#8e44ad'];

export function Pelangi() {
  return (
    <g>
      {RAINBOW.map((c, i) => (
        <path key={c} className="arc" style={{ ['--i' as string]: i }} d={`M${-300 + i * 20} 0 A${300 - i * 20} ${300 - i * 20} 0 0 1 ${300 - i * 20} 0`} fill="none" stroke={c} strokeWidth="21" opacity=".92" />
      ))}
    </g>
  );
}

export function Petir() {
  return (
    <g>
      <path d="M10 -280 L-34 -150 L-4 -150 L-30 -40 L-6 -40 L-22 0 L42 -120 L10 -120 L44 -210 L18 -210 L40 -280z" fill="#fff6a8" stroke="#ffd21f" strokeWidth="5" strokeLinejoin="round" />
      <path d="M10 -280 L-34 -150 L-4 -150 L-30 -40 L-6 -40 L-22 0 L42 -120 L10 -120 L44 -210 L18 -210 L40 -280z" fill="#ffd21f" opacity=".35" />
    </g>
  );
}

export function Layangan({ v = 0 }: CharProps) {
  const a = ['#ee3b3b', '#2f8fe8', '#8e44ad', '#4cbf4c'][v % 4];
  const b = ['#ffd21f', '#fff', '#ff9a1f', '#ffd21f'][v % 4];
  return (
    <g className="kite">
      <path d="M0 40 Q-30 100 10 150 T-10 260" stroke="#fff" strokeWidth="2" fill="none" opacity=".9" />
      <g className="tail">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-6 + i * 4} ${52 + i * 26} l-9 8 l9 8 l-9 8z`} fill={i % 2 ? a : b} />
        ))}
      </g>
      <path d="M0 -50 L34 0 L0 46 L-34 0z" fill={a} />
      <path d="M0 -50 L34 0 L0 0z M0 46 L-34 0 L0 0z" fill={b} />
      <path d="M0 -50 V46 M-34 0 H34" stroke="#8a5a2b" strokeWidth="2.4" />
    </g>
  );
}

export function Kincir() {
  return (
    <g>
      <path d="M-26 0 L-12 -150 H12 L26 0z" fill="#e9dcc4" stroke="#bfae8a" strokeWidth="3" />
      <path d="M-18 -60 H18 M-22 -30 H22 M-14 -100 H14" stroke="#cdbd9a" strokeWidth="2" />
      <rect x="-9" y="-36" width="18" height="36" rx="4" fill="#8a5a2b" />
      <path d="M-18 -150 L0 -176 L18 -150z" fill="#b3472d" />
      <g transform="translate(0 -150)">
        <g className="spin-blades">
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <rect x="-4" y="-96" width="8" height="96" fill="#8a5a2b" />
              <path d="M4 -92 H34 V-46 H4z" fill="#fffaf0" stroke="#bfae8a" strokeWidth="2" />
              <path d="M4 -69 H34 M19 -92 V-46" stroke="#cdbd9a" strokeWidth="1.5" />
            </g>
          ))}
        </g>
        <circle r="8" fill="#6a421e" />
      </g>
    </g>
  );
}

export function Angin() {
  return (
    <g className="wind" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".9">
      <path d="M-120 -30 H40 Q80 -30 80 -60 Q80 -86 54 -84" />
      <path d="M-90 10 H110 Q150 10 150 40 Q150 66 122 64" />
      <path d="M-130 50 H0 Q30 50 30 70 Q30 88 10 86" />
    </g>
  );
}

/** Tunas: kecambah kecil yang tumbuh di atas tanah. */
export function Tunas({ v = 0 }: CharProps) {
  const leaf = ['#4fa04a', '#3f8c47', '#62b04f'][v % 3];
  return (
    <g>
      <ellipse cx="0" cy="-6" rx="46" ry="12" fill="#9a7a52" />
      <ellipse cx="0" cy="-10" rx="46" ry="10" fill="#a8895f" />
      <path d="M0 -8 V-58" stroke="#4c8a3a" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 -40 Q-30 -62 -42 -36 Q-16 -22 0 -40Z" fill={leaf} />
      <path d="M0 -46 Q30 -68 42 -42 Q16 -28 0 -46Z" fill={leaf} />
      <path d="M-14 -34 Q-22 -44 -34 -40 M14 -40 Q22 -50 34 -46" stroke="#3f7a32" strokeWidth="2" fill="none" opacity=".5" />
    </g>
  );
}

/** Kursi kayu sederhana untuk ruangan di dalam rumah. */
export function Kursi({ v = 0 }: CharProps) {
  const wood = ['#b07a44', '#c8934f', '#98672f'][v % 3];
  const dark = ['#8a5c2f', '#a06f3c', '#734c28'][v % 3];
  return (
    <g>
      <rect x="-48" y="-100" width="14" height="100" rx="4" fill={dark} />
      <rect x="34" y="-100" width="14" height="100" rx="4" fill={dark} />
      <rect x="-44" y="-96" width="88" height="48" rx="7" fill={wood} />
      <rect x="-34" y="-86" width="68" height="28" rx="5" fill={dark} opacity=".3" />
      <rect x="-54" y="-46" width="108" height="18" rx="6" fill={wood} />
      <rect x="-44" y="-28" width="12" height="28" rx="3" fill={dark} />
      <rect x="32" y="-28" width="12" height="28" rx="3" fill={dark} />
    </g>
  );
}
