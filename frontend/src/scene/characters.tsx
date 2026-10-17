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
