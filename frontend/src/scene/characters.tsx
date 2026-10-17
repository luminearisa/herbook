import type { Mood, Pose } from '../types';

export interface CharProps {
  pose?: Pose;
  mood?: Mood;
  v?: number;
}

const INK = '#2b1a0f';

/* ---------------- Kancil ---------------- */

const BODY = '#c98a4b';
const BODY_DARK = '#8a5a2b';
const BELLY = '#f6e3bd';

function KancilFace({ mood }: { mood: Mood }) {
  const eye = (() => {
    switch (mood) {
      case 'pingsan':
        return (
          <path d="M51 -108 l10 10 M61 -108 l-10 10" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        );
      case 'kaget':
        return (
          <>
            <circle cx="56" cy="-103" r="7.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <circle cx="57" cy="-103" r="2.6" fill={INK} />
          </>
        );
      case 'takut':
        return (
          <>
            <circle cx="56" cy="-103" r="6.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <circle cx="56.5" cy="-102" r="2" fill={INK} />
          </>
        );
      case 'licik':
        return (
          <>
            <circle cx="56" cy="-103" r="5.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <circle cx="58" cy="-102" r="3" fill={INK} />
            <path d="M49.5 -104 Q56 -111 62.5 -104 Z" fill={BODY} stroke={INK} strokeWidth="1.5" />
          </>
        );
      default:
        return (
          <>
            <circle cx="56" cy="-103" r="5.8" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <circle cx="57.5" cy="-103" r="3.2" fill={INK} />
            <circle cx="58.6" cy="-104.4" r="1.1" fill="#fff" />
          </>
        );
    }
  })();

  const brow = (() => {
    switch (mood) {
      case 'marah':
        return <path d="M48 -116 L63 -109" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />;
      case 'sedih':
      case 'takut':
        return <path d="M49 -110 L63 -115" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />;
      case 'licik':
        return <path d="M49 -110 L63 -113" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />;
      default:
        return null;
    }
  })();

  const mouth = (() => {
    switch (mood) {
      case 'senang':
        return <path d="M63 -89 Q71 -82 79 -90" fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />;
      case 'licik':
        return <path d="M63 -89 Q72 -87 80 -95" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
      case 'sedih':
        return <path d="M64 -86 Q71 -92 78 -87" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
      case 'marah':
        return <path d="M64 -88 L78 -90" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />;
      case 'kaget':
      case 'takut':
        return <ellipse cx="71" cy="-87" rx="3.5" ry="4.5" fill="#5a2a1a" />;
      default:
        return <path d="M64 -88 Q71 -86 78 -89" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />;
    }
  })();

  return (
    <g>
      {(mood === 'senang' || mood === 'licik') && <circle cx="52" cy="-93" r="4.5" fill="#f19a8a" opacity=".6" />}
      {eye}
      {brow}
      {mouth}
      {mood === 'takut' && <path d="M38 -128 q-4 7 0 10 q4 -3 0 -10z" fill="#7fd0ff" stroke="#3a8fc0" strokeWidth="1" />}
      {mood === 'sedih' && <path d="M60 -96 q-3 7 0 9 q3 -2 0 -9z" fill="#7fd0ff" opacity=".9" />}
    </g>
  );
}

const LEG_ROT: Record<string, [number, number, number, number]> = {
  // [belakang jauh, belakang dekat, depan jauh, depan dekat]
  berdiri: [0, 0, 0, 0],
  renang: [0, 0, 0, 0],
  lari: [-38, 32, 40, -30],
  lompat: [-62, -38, 58, 34],
  rebah: [10, -8, 14, -10],
};

function Leg({ x, rot, shade }: { x: number; rot: number; shade?: boolean }) {
  return (
    <g transform={`translate(${x} -48) rotate(${rot})`}>
      <path d="M0 0 L0 44" stroke={shade ? '#6e4721' : BODY_DARK} strokeWidth="6" strokeLinecap="round" />
      <path d="M-3.5 40 h7 l-1 8 h-5z" fill="#2b1a0f" />
    </g>
  );
}

export function Kancil({ pose = 'berdiri', mood = 'senang' }: CharProps) {
  const rot = LEG_ROT[pose] ?? LEG_ROT.berdiri;
  const lying = pose === 'rebah';
  const lift = pose === 'lompat' ? -34 : 0;
  const tilt = pose === 'lari' ? -6 : pose === 'lompat' ? -12 : 0;
  return (
    <g transform={lying ? 'translate(0 -128) scale(1 -1)' : `translate(0 ${lift}) rotate(${tilt} 0 -60)`}>
      <Leg x={-28} rot={rot[0]} shade />
      <Leg x={34} rot={rot[2]} shade />
      {/* ekor */}
      <path d="M-44 -72 Q-58 -80 -54 -92 Q-46 -84 -40 -78z" fill="#fff6e0" stroke={BODY_DARK} strokeWidth="1.5" strokeLinejoin="round" />
      {/* badan */}
      <ellipse cx="0" cy="-64" rx="48" ry="25" fill={BODY} />
      <path d="M-44 -56 Q0 -36 46 -56 Q40 -42 0 -40 Q-38 -40 -44 -56z" fill={BELLY} />
      {[[-22, -78], [-4, -84], [14, -80], [-34, -66], [28, -72], [6, -68]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.6" fill="#fff3d6" opacity=".95" />
      ))}
      {/* leher + kepala */}
      <path d="M26 -78 Q44 -88 48 -112 L62 -112 Q60 -84 44 -50 Z" fill={BODY} />
      <path d="M44 -66 Q54 -72 58 -90 L52 -90 Q48 -74 40 -62z" fill={BELLY} opacity=".9" />
      <ellipse cx="52" cy="-101" rx="20" ry="16" fill={BODY} />
      <path d="M58 -108 Q82 -108 86 -97 Q84 -86 62 -86 Q54 -92 58 -108z" fill={BODY} />
      <path d="M62 -88 Q76 -85 85 -92 Q84 -86 62 -84z" fill={BELLY} />
      <ellipse cx="84" cy="-97" rx="3.8" ry="3.2" fill={INK} />
      {/* telinga */}
      <ellipse cx="38" cy="-119" rx="7" ry="16" fill={BODY} transform="rotate(-24 38 -119)" />
      <ellipse cx="38" cy="-118" rx="3.6" ry="11" fill="#f4b9a0" transform="rotate(-24 38 -118)" />
      <KancilFace mood={mood} />
      <Leg x={-18} rot={rot[1]} />
      <Leg x={24} rot={rot[3]} />
    </g>
  );
}

/* ---------------- Buaya ---------------- */

const CROC = '#4f9a4a';
const CROC_DARK = '#2f6e3a';
const CROC_BELLY = '#d6e6a0';

export function Buaya({ pose = 'berdiri', mood = 'marah' }: CharProps) {
  const swim = pose === 'renang';
  const open = mood === 'marah' || mood === 'kaget' ? 20 : mood === 'senang' ? 6 : 0;
  const teeth = Array.from({ length: 8 }, (_, i) => 70 + i * 8);
  return (
    <g>
      {swim && (
        <defs>
          <clipPath id="croc-clip">
            <rect x="-150" y="-80" width="320" height="80" />
          </clipPath>
        </defs>
      )}
      <g clipPath={swim ? 'url(#croc-clip)' : undefined}>
        {/* ekor + badan */}
        <path d="M-132 -22 C-118 -34 -92 -26 -70 -30 L55 -34 L55 0 L-70 0 C-100 0 -120 -4 -132 -22z" fill={CROC} />
        <path d="M-132 -22 C-124 -14 -112 -2 -70 0 L55 0 L55 -10 L-70 -8 C-104 -8 -124 -12 -132 -22z" fill={CROC_BELLY} opacity=".85" />
        {/* punggung bergerigi */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${-100 + i * 18} -30 l8 -13 l8 13z`} fill={CROC_DARK} />
        ))}
        {!swim && (
          <>
            <rect x="-60" y="-4" width="16" height="12" rx="5" fill={CROC_DARK} />
            <rect x="26" y="-4" width="16" height="12" rx="5" fill={CROC_DARK} />
          </>
        )}
        {/* rahang bawah */}
        <g transform={`rotate(${open} 52 -14)`}>
          <path d="M52 -14 L138 -18 Q144 -10 136 -6 L60 0 Q46 0 46 -8z" fill={CROC} />
          <path d="M60 -8 L134 -12 L136 -6 L60 0z" fill={CROC_BELLY} />
          {open > 0 && <path d="M60 -14 L134 -17 L134 -12 L60 -9z" fill="#c64a5a" />}
        </g>
        {/* kepala atas */}
        <path d="M44 -36 Q70 -48 104 -37 L140 -25 Q146 -20 140 -16 L52 -14 Z" fill={CROC} />
        <path d="M50 -22 L140 -20 L140 -16 L52 -14z" fill={CROC_DARK} opacity=".5" />
        {open > 0 && (
          <path d={`M74 -15 ${teeth.map((x) => `L${x} -15 l4 8 l4 -8`).join(' ')}`} fill="#fff" stroke="#fff" strokeWidth=".5" />
        )}
        <circle cx="136" cy="-29" r="2.4" fill={CROC_DARK} />
        {/* mata */}
        <circle cx="76" cy="-42" r="10" fill={CROC} />
        <circle cx="77" cy="-43" r="6.5" fill="#ffe56a" stroke={INK} strokeWidth="1.3" />
        {mood === 'kaget' ? (
          <circle cx="78" cy="-43" r="2.4" fill={INK} />
        ) : (
          <ellipse cx="78" cy="-43" rx="1.8" ry="5" fill={INK} />
        )}
        {mood === 'marah' && <path d="M66 -54 L88 -45" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />}
        {mood === 'senang' && <circle cx="66" cy="-26" r="3.5" fill="#f19a8a" opacity=".6" />}
      </g>
      {swim && (
        <>
          <ellipse cx="0" cy="-1" rx="140" ry="7" fill="#fff" opacity=".35" />
          <ellipse cx="60" cy="1" rx="60" ry="4" fill="#fff" opacity=".35" />
        </>
      )}
    </g>
  );
}

/* ---------------- Harimau ---------------- */

export function Harimau({ pose = 'berdiri', mood = 'marah' }: CharProps) {
  const rot = LEG_ROT[pose] ?? LEG_ROT.berdiri;
  const tiger = '#f08a2c';
  const leg = (x: number, r: number, dark = false) => (
    <g transform={`translate(${x} -50) rotate(${r})`}>
      <rect x="-8" y="0" width="16" height="50" rx="7" fill={dark ? '#d97a22' : tiger} />
      <path d="M-8 22 h16 M-8 34 h12" stroke={INK} strokeWidth="3" />
      <ellipse cx="2" cy="50" rx="11" ry="5" fill="#fff6e8" />
    </g>
  );
  return (
    <g>
      {leg(-36, rot[0], true)}
      {leg(34, rot[2], true)}
      <path d="M-62 -76 Q-92 -84 -88 -48 Q-86 -40 -80 -46 Q-80 -64 -58 -66z" fill={tiger} stroke={INK} strokeWidth="1" />
      <path d="M-80 -60 l8 4 M-84 -50 l8 2" stroke={INK} strokeWidth="3" />
      <ellipse cx="0" cy="-76" rx="64" ry="34" fill={tiger} />
      <path d="M-56 -66 Q0 -40 58 -66 Q50 -46 0 -44 Q-48 -44 -56 -66z" fill="#fff0d8" />
      <path d="M-40 -104 l8 24 M-22 -108 l5 28 M-4 -108 l3 30 M16 -106 l-1 28 M34 -100 l-5 24" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {leg(-22, rot[1])}
      {leg(46, rot[3])}
      <circle cx="68" cy="-98" r="28" fill={tiger} />
      <circle cx="50" cy="-122" r="9" fill={tiger} /><circle cx="50" cy="-122" r="4.5" fill="#f4b9a0" />
      <circle cx="82" cy="-122" r="9" fill={tiger} /><circle cx="82" cy="-122" r="4.5" fill="#f4b9a0" />
      <path d="M52 -122 l4 10 M80 -122 l-4 10 M68 -126 v10" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="78" cy="-88" rx="18" ry="13" fill="#fff6e8" />
      <path d="M74 -96 l5 0 l-2.5 4z" fill="#d9606a" />
      <circle cx="62" cy="-102" r="5" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx="63.5" cy="-102" r="2.6" fill={INK} />
      {mood === 'marah' ? (
        <>
          <path d="M54 -112 L72 -105" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M68 -86 Q78 -80 88 -86 L86 -81 L82 -85 L78 -80 L74 -85 L70 -81z" fill="#fff" stroke={INK} strokeWidth="1.5" />
        </>
      ) : (
        <path d="M68 -86 Q78 -80 88 -86" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      )}
      <path d="M92 -90 l18 -4 M92 -86 l18 2" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

/* ---------------- Petani ---------------- */

export function Petani({ mood = 'senang' }: CharProps) {
  const skin = '#c98655';
  return (
    <g>
      <rect x="-22" y="-62" width="18" height="62" rx="6" fill="#4a3b8f" />
      <rect x="4" y="-62" width="18" height="62" rx="6" fill="#4a3b8f" />
      <rect x="-27" y="-6" width="24" height="9" rx="4" fill={skin} />
      <rect x="3" y="-6" width="24" height="9" rx="4" fill={skin} />
      <path d="M-30 -66 Q-30 -118 0 -118 Q30 -118 30 -66 Z" fill="#6aa84f" />
      <rect x="-30" y="-74" width="60" height="9" fill="#8a5a2b" />
      <rect x="-50" y="-112" width="16" height="48" rx="8" fill={skin} transform="rotate(8 -42 -112)" />
      <rect x="34" y="-112" width="16" height="48" rx="8" fill={skin} transform="rotate(-8 42 -112)" />
      <rect x="-5" y="-126" width="10" height="12" fill={skin} />
      <circle cx="0" cy="-138" r="20" fill={skin} />
      {/* caping */}
      <path d="M-44 -146 Q0 -184 44 -146 Q0 -138 -44 -146z" fill="#e7c36b" stroke="#a8802c" strokeWidth="2" />
      <path d="M-30 -153 L0 -178 L30 -153 M-14 -150 L0 -178 L14 -150" fill="none" stroke="#a8802c" strokeWidth="1.2" />
      <circle cx="-7" cy="-136" r="2.6" fill={INK} /><circle cx="8" cy="-136" r="2.6" fill={INK} />
      {mood === 'marah' ? (
        <>
          <path d="M-13 -144 L-3 -140 M14 -144 L4 -140" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M-6 -125 Q0 -129 6 -125" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : mood === 'kaget' ? (
        <ellipse cx="0" cy="-125" rx="4" ry="5" fill="#5a2a1a" />
      ) : mood === 'licik' ? (
        <path d="M-7 -126 Q0 -121 8 -128" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M-7 -127 Q0 -120 7 -127" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      )}
    </g>
  );
}

/* ---------------- Kura-kura, burung, kupu-kupu ---------------- */

export function Kurakura({ mood = 'senang' }: CharProps) {
  return (
    <g>
      <ellipse cx="-34" cy="-4" rx="12" ry="7" fill="#8bc16a" /><ellipse cx="22" cy="-4" rx="12" ry="7" fill="#8bc16a" />
      <path d="M-50 -8 Q-50 -52 0 -52 Q50 -52 50 -8z" fill="#7a5a2c" stroke="#4a3418" strokeWidth="2" />
      <path d="M-26 -12 L-14 -46 M0 -12 V-50 M26 -12 L14 -46 M-44 -26 H44" stroke="#4a3418" strokeWidth="2" fill="none" />
      <ellipse cx="58" cy="-24" rx="14" ry="12" fill="#8bc16a" />
      <circle cx="63" cy="-27" r="3.4" fill="#fff" stroke={INK} /><circle cx="64" cy="-27" r="1.7" fill={INK} />
      <path d="M62 -18 Q67 -15 71 -19" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity={mood === 'sedih' ? 0.4 : 1} />
    </g>
  );
}

export function Burung({ v = 0 }: CharProps) {
  const c = ['#4aa3df', '#e4572e', '#f2b134', '#7d5ba6'][v % 4];
  return (
    <g className="flap">
      <ellipse cx="0" cy="0" rx="18" ry="11" fill={c} />
      <path d="M-18 0 L-32 -6 L-30 6z" fill={c} />
      <circle cx="16" cy="-6" r="8" fill={c} />
      <path d="M23 -7 L33 -4 L23 -2z" fill="#f2b134" />
      <circle cx="18" cy="-8" r="2" fill={INK} />
      <path d="M-4 -2 Q-12 -22 6 -24 Q10 -10 4 0z" fill="#fff" opacity=".55" />
    </g>
  );
}

export function Kupu({ v = 0 }: CharProps) {
  const c = ['#f26ca7', '#ffb300', '#7e57c2', '#29b6f6'][v % 4];
  return (
    <g className="flutter">
      <path d="M0 0 Q-24 -30 -26 -8 Q-24 8 0 2z" fill={c} />
      <path d="M0 0 Q24 -30 26 -8 Q24 8 0 2z" fill={c} />
      <path d="M0 2 Q-16 18 -8 22 Q0 16 0 2z M0 2 Q16 18 8 22 Q0 16 0 2z" fill={c} opacity=".8" />
      <circle cx="-14" cy="-8" r="3.5" fill="#fff" opacity=".7" /><circle cx="14" cy="-8" r="3.5" fill="#fff" opacity=".7" />
      <rect x="-1.5" y="-8" width="3" height="22" rx="1.5" fill={INK} />
    </g>
  );
}

/* ---------------- Gajah ---------------- */

export function Gajah({ pose = 'berdiri', mood = 'senang' }: CharProps) {
  const g = '#8f9bb0';
  const dark = '#6f7b92';
  const rot = LEG_ROT[pose] ?? LEG_ROT.berdiri;
  const leg = (x: number, r: number, shade: boolean) => (
    <g transform={`translate(${x} -70) rotate(${r})`}>
      <rect x="-17" y="0" width="34" height="70" rx="14" fill={shade ? dark : g} />
      <path d="M-14 62 h28" stroke="#e8dcc8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      {leg(-52, rot[0], true)}
      {leg(52, rot[2], true)}
      <path d="M-88 -120 Q-112 -100 -100 -62" stroke={dark} strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-112" rx="92" ry="58" fill={g} />
      {leg(-34, rot[1], false)}
      {leg(70, rot[3], false)}
      <ellipse cx="62" cy="-124" rx="34" ry="46" fill={dark} />
      <ellipse cx="62" cy="-124" rx="24" ry="36" fill="#d9a5b3" opacity=".7" />
      <circle cx="108" cy="-132" r="44" fill={g} />
      <path d="M126 -104 Q158 -96 156 -60 Q154 -28 140 -22 Q128 -26 138 -50 Q142 -76 120 -86z" fill={g} />
      <path d="M134 -92 Q150 -70 146 -40" stroke={dark} strokeWidth="2" fill="none" />
      <path d="M118 -100 Q146 -92 150 -70 Q138 -84 116 -88z" fill="#f4ecd8" />
      <circle cx="120" cy="-146" r="6.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx={mood === 'kaget' ? 121 : 122} cy="-146" r={mood === 'kaget' ? 2 : 3.2} fill={INK} />
      {mood === 'marah' && <path d="M108 -160 L132 -150" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
      {mood === 'senang' && <path d="M122 -104 Q132 -98 142 -108" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />}
      {mood === 'takut' && <path d="M104 -170 q-4 8 0 11 q4 -3 0 -11z" fill="#7fd0ff" stroke="#3a8fc0" />}
    </g>
  );
}

/* ---------------- Semut, hud-hud, ababil ---------------- */

export function Semut({ mood = 'senang', v = 0 }: CharProps) {
  const col = '#6b2d1a';
  const up = mood === 'kaget' || mood === 'takut';
  return (
    <g>
      {[[-22, -6, -34, 0], [-6, -8, -6, 0], [10, -8, 22, 0]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2} ${y1 - 8} L${x2} ${y2}`} stroke={col} strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      {[[-14, -8, -26, 0], [2, -8, 4, 0], [14, -8, 30, 0]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2} ${y1 - 10} L${x2} ${y2}`} stroke="#8a3f26" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx="-32" cy="-18" rx="21" ry="14" fill={col} />
      <ellipse cx="-3" cy="-20" rx="13" ry="10" fill="#8a3f26" />
      <circle cx="22" cy="-24" r="12" fill={col} />
      <path d={up ? 'M26 -34 Q32 -52 40 -54' : 'M26 -34 Q34 -44 44 -42'} stroke={col} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d={up ? 'M20 -35 Q18 -52 8 -56' : 'M20 -35 Q22 -48 12 -50'} stroke={col} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="27" cy="-27" r={up ? 4.6 : 3.6} fill="#fff" /><circle cx="28" cy="-27" r="1.8" fill={INK} />
      {mood === 'senang' ? (
        <path d="M24 -19 Q29 -15 33 -20" stroke="#f8d6c8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="30" cy="-18" rx="2" ry={up ? 3 : 1.4} fill="#f8d6c8" />
      )}
      {v === 1 && <circle cx="-34" cy="-40" r="5" fill="#fff6e0" stroke="#d9c9a0" />}
    </g>
  );
}

export function Hudhud() {
  const body = '#e2994f';
  return (
    <g className="flap">
      <path d="M-16 2 L-38 10 L-36 -4z" fill="#2b1a0f" />
      <path d="M-34 4 L-27 3 M-33 -1 L-26 -1" stroke="#fff" strokeWidth="3" />
      <ellipse cx="0" cy="0" rx="22" ry="13" fill={body} />
      <path d="M-8 -4 Q-18 -26 8 -28 Q12 -12 6 -2z" fill="#2b1a0f" />
      <path d="M-12 -13 q8 -4 16 -2 M-12 -19 q8 -4 16 -2" stroke="#fff" strokeWidth="3" fill="none" />
      <circle cx="20" cy="-8" r="9" fill={body} />
      {[-38, -18, 0, 18, 38].map((a) => (
        <path key={a} d="M0 0 L-3 -22 L3 -22z" fill="#e2994f" stroke="#2b1a0f" strokeWidth=".8" transform={`translate(20 -14) rotate(${a} 0 6)`} />
      ))}
      {[-38, -18, 0, 18, 38].map((a) => (
        <circle key={a} cx="0" cy="-22" r="2" fill="#2b1a0f" transform={`translate(20 -14) rotate(${a} 0 6)`} />
      ))}
      <path d="M28 -8 Q44 -6 50 4" stroke="#3b2412" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="-10" r="2" fill={INK} />
    </g>
  );
}

export function Ababil({ v = 0 }: CharProps) {
  return (
    <g className="flap">
      <path d="M-14 0 L-30 -8 L-28 6z" fill="#3d4654" />
      <ellipse cx="0" cy="0" rx="16" ry="9" fill="#586273" />
      <path d="M-2 -2 Q-8 -22 10 -22 Q10 -8 6 0z" fill="#3d4654" />
      <circle cx="14" cy="-5" r="7" fill="#586273" />
      <path d="M20 -6 L28 -3 L20 -1z" fill="#f2b134" />
      <circle cx="16" cy="-7" r="1.7" fill="#fff" />
      {v === 0 && <circle cx="30" cy="1" r="3.6" fill="#8a6a45" stroke="#5a4028" strokeWidth="1" />}
    </g>
  );
}

/* ---------------- Fabel: kelinci, singa, tikus, belalang ---------------- */

/** Mata, alis, dan mulut generik untuk hewan baru; (ex,ey) mata, (mx,my) ujung mulut. */
function SimpleFace({ ex, ey, mx, my, mood, r = 5 }: { ex: number; ey: number; mx: number; my: number; mood: Mood; r?: number }) {
  if (mood === 'pingsan') {
    return <path d={`M${ex - 5} ${ey - 5} l10 10 M${ex + 5} ${ey - 5} l-10 10`} stroke={INK} strokeWidth="2.4" strokeLinecap="round" />;
  }
  const big = mood === 'kaget' || mood === 'takut';
  return (
    <g>
      <circle cx={ex} cy={ey} r={big ? r + 2 : r} fill="#fff" stroke={INK} strokeWidth="1.4" />
      <circle cx={ex + 1.4} cy={ey} r={big ? 2.2 : r * 0.55} fill={INK} />
      {mood === 'licik' && <path d={`M${ex - r - 1} ${ey - 1} Q${ex} ${ey - r - 5} ${ex + r + 1} ${ey - 1}Z`} fill="currentColor" stroke={INK} strokeWidth="1.3" />}
      {(mood === 'marah') && <path d={`M${ex - 7} ${ey - 9} L${ex + 7} ${ey - 4}`} stroke={INK} strokeWidth="2.6" strokeLinecap="round" />}
      {(mood === 'sedih' || mood === 'takut') && <path d={`M${ex - 6} ${ey - 4} L${ex + 7} ${ey - 10}`} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />}
      {mood === 'senang' && <path d={`M${mx - 9} ${my} Q${mx} ${my + 8} ${mx + 9} ${my - 4}`} fill="#fff" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />}
      {mood === 'licik' && <path d={`M${mx - 8} ${my} Q${mx} ${my + 2} ${mx + 9} ${my - 8}`} fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />}
      {mood === 'sedih' && <path d={`M${mx - 8} ${my + 3} Q${mx} ${my - 5} ${mx + 8} ${my + 2}`} fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />}
      {mood === 'marah' && <path d={`M${mx - 8} ${my + 1} L${mx + 8} ${my - 2}`} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />}
      {big && <ellipse cx={mx} cy={my + 2} rx="3" ry="4" fill="#5a2a1a" />}
      {mood === 'takut' && <path d={`M${ex - 14} ${ey - 24} q-4 7 0 10 q4 -3 0 -10z`} fill="#7fd0ff" stroke="#3a8fc0" strokeWidth="1" />}
    </g>
  );
}

function Zzz({ x, y }: { x: number; y: number }) {
  return (
    <g className="drift-b" fontFamily="Fredoka, sans-serif" fill="#5b6c9c" fontWeight="700">
      <text x={x} y={y} fontSize="22">Z</text>
      <text x={x + 18} y={y - 20} fontSize="17">z</text>
      <text x={x + 32} y={y - 36} fontSize="13">z</text>
    </g>
  );
}

export function Kelinci({ pose = 'berdiri', mood = 'senang' }: CharProps) {
  const fur = '#ece6dc';
  const sleep = pose === 'tidur';
  const run = pose === 'lari';
  const m: Mood = sleep ? 'senang' : mood;
  return (
    <g transform={run ? 'translate(0 -8) rotate(-8 0 -40)' : undefined}>
      <ellipse cx={run ? -36 : -16} cy="-5" rx="22" ry="7" fill="#d8d0c2" transform={run ? 'rotate(-18 -36 -5)' : undefined} />
      <ellipse cx="-30" cy="-32" rx="24" ry="28" fill="#dcd5c9" />
      <path d="M-44 -62 Q-60 -64 -56 -48 Q-48 -50 -44 -62z" fill="#fff" />
      <ellipse cx="0" cy="-50" rx="44" ry="30" fill={fur} />
      <circle cx="-48" cy="-54" r="12" fill="#fff" />
      <rect x={run ? 34 : 24} y="-42" width="12" height="38" rx="6" fill={fur} transform={run ? 'rotate(-30 40 -42)' : undefined} />
      <ellipse cx={run ? 52 : 32} cy="-3" rx="12" ry="6" fill="#d8d0c2" />
      <ellipse cx="42" cy="-122" rx="8" ry="28" fill={fur} transform="rotate(-8 42 -122)" />
      <ellipse cx="42" cy="-122" rx="3.6" ry="21" fill="#f4b9c4" transform="rotate(-8 42 -122)" />
      <ellipse cx="60" cy="-124" rx="8" ry="28" fill={fur} transform="rotate(12 60 -124)" />
      <ellipse cx="60" cy="-124" rx="3.6" ry="21" fill="#f4b9c4" transform="rotate(12 60 -124)" />
      <circle cx="50" cy="-84" r="25" fill={fur} />
      <ellipse cx="68" cy="-76" rx="12" ry="9" fill="#fffaf0" />
      <ellipse cx="78" cy="-80" rx="3.6" ry="3" fill="#e88aa0" />
      <path d="M80 -76 L80 -72 M76 -72 Q80 -69 84 -72" stroke={INK} strokeWidth="1.2" fill="none" />
      <path d="M82 -78 l16 -4 M82 -75 l16 3" stroke="#9a8f80" strokeWidth="1" />
      {sleep ? (
        <>
          <path d="M50 -88 q6 5 12 0" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <Zzz x={70} y={-120} />
        </>
      ) : (
        <>
          <g style={{ color: fur }}><SimpleFace ex={57} ey={-90} mx={70} my={-70} mood={m} /></g>
          <circle cx="52" cy="-76" r="4.5" fill="#f4a0b0" opacity=".5" />
        </>
      )}
    </g>
  );
}

export function Singa({ pose = 'berdiri', mood = 'senang' }: CharProps) {
  const fur = '#dca24c';
  const mane = '#8a4f1f';
  const sleep = pose === 'tidur';
  const run = pose === 'lari';
  const m: Mood = sleep ? 'senang' : mood;
  const rot = run ? [-30, 28, 30, -26] : [0, 0, 0, 0];
  const leg = (x: number, r: number, dark?: boolean) => (
    <g transform={`translate(${x} -52) rotate(${r})`}>
      <rect x="-10" y="0" width="20" height="52" rx="9" fill={dark ? '#c48a35' : fur} />
      <ellipse cx="3" cy="52" rx="13" ry="6" fill="#b87a2c" />
    </g>
  );
  const head = (cx: number, cy: number) => (
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={cx + Math.cos((i * Math.PI) / 6) * 36} cy={cy + Math.sin((i * Math.PI) / 6) * 36} r="15" fill={mane} />
      ))}
      <circle cx={cx} cy={cy} r="36" fill="#a35f27" />
      <circle cx={cx - 14} cy={cy - 30} r="9" fill={fur} /><circle cx={cx + 14} cy={cy - 32} r="9" fill={fur} />
      <circle cx={cx + 2} cy={cy} r="27" fill="#e8b45a" />
      <ellipse cx={cx + 18} cy={cy + 8} rx="15" ry="12" fill="#f7e2b0" />
      <path d={`M${cx + 24} ${cy} l9 0 l-4.5 6z`} fill="#6a3a1a" />
      {sleep ? (
        <path d={`M${cx + 4} ${cy - 6} q7 6 14 0`} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : (
        <g style={{ color: '#e8b45a' }}><SimpleFace ex={cx + 10} ey={cy - 6} mx={cx + 24} my={cy + 14} mood={m} /></g>
      )}
    </g>
  );
  if (sleep) {
    return (
      <g>
        <path d="M-70 -20 Q-96 -30 -90 -52" stroke={fur} strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="-90" cy="-56" r="9" fill={mane} />
        <ellipse cx="-4" cy="-34" rx="70" ry="34" fill={fur} />
        <ellipse cx="50" cy="-4" rx="36" ry="9" fill="#c48a35" />
        <ellipse cx="86" cy="-6" rx="18" ry="8" fill="#b87a2c" />
        {head(78, -42)}
        <Zzz x={118} y={-84} />
      </g>
    );
  }
  return (
    <g>
      <path d="M-78 -76 Q-110 -80 -100 -42" stroke={fur} strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="-100" cy="-40" r="10" fill={mane} />
      {leg(-50, rot[0], true)}
      {leg(46, rot[2], true)}
      <ellipse cx="0" cy="-74" rx="82" ry="38" fill={fur} />
      <path d="M-70 -62 Q0 -38 74 -62 Q60 -44 0 -42 Q-60 -42 -70 -62z" fill="#f2d391" />
      {leg(-30, rot[1])}
      {leg(62, rot[3])}
      {head(86, -106)}
    </g>
  );
}

export function Tikus({ mood = 'senang' }: CharProps) {
  const fur = '#a9a3a8';
  return (
    <g>
      <path d="M-26 -10 Q-52 -8 -50 -30 Q-48 -44 -36 -40" stroke="#e8a3b0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="-4" cy="-4" rx="9" ry="4.5" fill="#8a848a" /><ellipse cx="18" cy="-3" rx="9" ry="4.5" fill="#8a848a" />
      <ellipse cx="-2" cy="-18" rx="25" ry="15" fill={fur} />
      <ellipse cx="2" cy="-12" rx="17" ry="8" fill="#e6e1e4" />
      <circle cx="24" cy="-24" r="13" fill={fur} />
      <path d="M32 -30 Q52 -22 34 -14z" fill={fur} />
      <circle cx="46" cy="-22" r="3.3" fill="#e88aa0" />
      <circle cx="14" cy="-38" r="9" fill={fur} /><circle cx="14" cy="-38" r="5.2" fill="#f4b9c4" />
      <circle cx="26" cy="-40" r="9" fill={fur} /><circle cx="26" cy="-40" r="5.2" fill="#f4b9c4" />
      <path d="M46 -22 l14 -4 M46 -20 l14 2" stroke="#7a747a" strokeWidth="1" />
      <g style={{ color: fur }}><SimpleFace ex={32} ey={-27} mx={40} my={-14} mood={mood} r={3.8} /></g>
    </g>
  );
}

export function Belalang({ pose = 'berdiri', mood = 'senang' }: CharProps) {
  const green = '#7bc043';
  const dark = '#4f9a2c';
  const jump = pose === 'lompat';
  return (
    <g transform={jump ? 'translate(0 -30) rotate(-20 0 -26)' : undefined}>
      {mood === 'senang' && (
        <g fontFamily="sans-serif" fill="#e4572e" fontWeight="700" className="flutter">
          <text x="30" y="-62" fontSize="22">♪</text><text x="52" y="-76" fontSize="16">♫</text>
        </g>
      )}
      <path d="M-4 -30 L-26 -62 L-40 -30 L-52 0" stroke={dark} strokeWidth="7" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M-6 -30 L-22 -56 L-34 -30z" fill={green} />
      <path d="M6 -22 L14 0 M16 -22 L30 0" stroke={dark} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="-4" cy="-30" rx="38" ry="12" fill={green} />
      <path d="M-34 -34 Q-10 -46 22 -36 Q-6 -30 -34 -34z" fill="#a8dc6a" />
      <circle cx="38" cy="-38" r="13" fill={green} />
      <path d="M44 -52 Q56 -78 74 -80 M36 -52 Q40 -76 56 -88" stroke={dark} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <g style={{ color: green }}><SimpleFace ex={42} ey={-41} mx={44} my={-30} mood={mood} r={4.6} /></g>
    </g>
  );
}
