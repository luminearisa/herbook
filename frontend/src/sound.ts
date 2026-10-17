import { useSyncExternalStore } from 'react';

/**
 * Suara dibuat langsung di browser dengan Web Audio (tanpa berkas, tanpa lisensi, jalan offline).
 * Kalau ada berkas rekaman asli di public/sounds (lihat sounds/manifest.json), berkas itu dipakai lebih dulu.
 */

const KEY = 'herbook-sound';
let enabled = (() => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
})();
const subs = new Set<() => void>();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let files: Record<string, string> = {};
let filesLoaded = false;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* abaikan */
  }
  if (!on) window.speechSynthesis?.cancel();
  subs.forEach((s) => s());
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => enabled,
  );
}

function audio(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOpts { f: number; f2?: number; dur: number; type?: OscillatorType; vol?: number; at?: number; vib?: number; lp?: number }

function tone(c: AudioContext, o: ToneOpts) {
  const t0 = c.currentTime + (o.at ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.f, t0);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + o.dur);
  const vol = o.vol ?? 0.2;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, o.dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  let node: AudioNode = osc;
  if (o.lp) {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = o.lp;
    osc.connect(f);
    node = f;
  }
  if (o.vib) {
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = o.vib;
    lg.gain.value = o.f * 0.05;
    lfo.connect(lg);
    lg.connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + o.dur);
  }
  node.connect(g);
  g.connect(master!);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

interface NoiseOpts { dur: number; bp?: number; q?: number; hp?: number; lp?: number; vol?: number; at?: number }

function noise(c: AudioContext, o: NoiseOpts) {
  const t0 = c.currentTime + (o.at ?? 0);
  const len = Math.max(1, Math.floor(c.sampleRate * o.dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  let node: AudioNode = src;
  const chain = (type: BiquadFilterType, freq: number, q?: number) => {
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    if (q) f.Q.value = q;
    node.connect(f);
    node = f;
  };
  if (o.hp) chain('highpass', o.hp);
  if (o.lp) chain('lowpass', o.lp);
  if (o.bp) chain('bandpass', o.bp, o.q ?? 1);
  const g = c.createGain();
  const vol = o.vol ?? 0.2;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.05, o.dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  node.connect(g);
  g.connect(master!);
  src.start(t0);
}

const SYNTH: Record<string, (c: AudioContext) => void> = {
  squeak: (c) => {
    tone(c, { f: 1300, f2: 2100, dur: 0.12, vol: 0.15 });
    tone(c, { f: 1500, f2: 2400, dur: 0.14, vol: 0.15, at: 0.15 });
  },
  roar: (c) => {
    tone(c, { f: 150, f2: 70, dur: 1.0, type: 'sawtooth', vol: 0.25, lp: 700, vib: 24 });
    noise(c, { dur: 1.0, bp: 300, q: 0.7, vol: 0.25 });
  },
  growl: (c) => {
    tone(c, { f: 95, f2: 60, dur: 0.8, type: 'square', vol: 0.14, lp: 400, vib: 18 });
    noise(c, { dur: 0.06, hp: 1500, vol: 0.3, at: 0.85 }); // bunyi rahang menutup
  },
  trumpet: (c) => {
    tone(c, { f: 280, f2: 520, dur: 0.45, type: 'sawtooth', vol: 0.18, lp: 1600, vib: 9 });
    tone(c, { f: 520, f2: 330, dur: 0.5, type: 'sawtooth', vol: 0.18, lp: 1600, vib: 9, at: 0.42 });
  },
  tweet: (c) => {
    [0, 0.13, 0.26].forEach((at, i) => tone(c, { f: 2300 + i * 150, f2: 3300 + i * 150, dur: 0.1, vol: 0.12, at }));
  },
  cricket: (c) => {
    for (let i = 0; i < 6; i++) tone(c, { f: 4300, dur: 0.05, type: 'square', vol: 0.05, at: i * 0.07, lp: 6000 });
  },
  tick: (c) => {
    tone(c, { f: 1800, f2: 900, dur: 0.04, vol: 0.12 });
    tone(c, { f: 1800, f2: 900, dur: 0.04, vol: 0.12, at: 0.08 });
  },
  rustle: (c) => noise(c, { dur: 0.7, bp: 3500, q: 0.6, vol: 0.2 }),
  rain: (c) => {
    noise(c, { dur: 1.3, hp: 3500, vol: 0.12 });
    for (let i = 0; i < 6; i++) tone(c, { f: 900 + Math.random() * 900, f2: 400, dur: 0.05, vol: 0.06, at: 0.1 + i * 0.17 });
  },
  chime: (c) => {
    [880, 1175, 1568].forEach((f, i) => tone(c, { f, dur: 0.5, vol: 0.12, at: i * 0.1 }));
  },
  knock: (c) => {
    tone(c, { f: 200, f2: 120, dur: 0.12, vol: 0.3 });
    tone(c, { f: 210, f2: 120, dur: 0.12, vol: 0.3, at: 0.2 });
  },
  thump: (c) => tone(c, { f: 130, f2: 55, dur: 0.22, vol: 0.35 }),
  splash: (c) => {
    noise(c, { dur: 0.5, lp: 2500, vol: 0.3 });
    tone(c, { f: 500, f2: 160, dur: 0.3, vol: 0.2 });
  },
  boing: (c) => tone(c, { f: 220, f2: 620, dur: 0.35, vol: 0.2, vib: 14 }),
  clink: (c) => {
    tone(c, { f: 2200, dur: 0.25, vol: 0.1 });
    tone(c, { f: 2900, dur: 0.2, vol: 0.08, at: 0.12 });
  },
  tinkle: (c) => {
    [2600, 3100, 2300, 3500, 2800].forEach((f, i) => tone(c, { f, dur: 0.18, vol: 0.09, at: i * 0.06 }));
  },
  fanfare: (c) => {
    [523, 659, 784, 1046].forEach((f, i) => tone(c, { f, dur: i === 3 ? 0.5 : 0.16, type: 'square', vol: 0.09, lp: 2400, at: i * 0.15 }));
  },
  creak: (c) => {
    tone(c, { f: 210, f2: 150, dur: 0.6, type: 'sawtooth', vol: 0.1, lp: 600, vib: 30 });
  },
  whale: (c) => {
    tone(c, { f: 130, f2: 260, dur: 0.9, vol: 0.22, vib: 6, lp: 900 });
    tone(c, { f: 260, f2: 150, dur: 1.0, vol: 0.2, vib: 6, lp: 900, at: 0.8 });
  },
  bubble: (c) => {
    [0, 0.09, 0.19].forEach((at, i) => tone(c, { f: 500 + i * 140, f2: 900 + i * 200, dur: 0.07, vol: 0.14, at }));
  },
  crackle: (c) => {
    noise(c, { dur: 0.9, lp: 700, vol: 0.18 });
    for (let i = 0; i < 9; i++) noise(c, { dur: 0.04, hp: 2500, vol: 0.25, at: 0.05 + i * 0.09 + Math.random() * 0.05 });
  },
  camel: (c) => {
    tone(c, { f: 190, f2: 120, dur: 0.55, type: 'sawtooth', vol: 0.18, lp: 700, vib: 13 });
    tone(c, { f: 150, f2: 100, dur: 0.4, type: 'sawtooth', vol: 0.14, lp: 600, vib: 11, at: 0.5 });
  },
  bark: (c) => {
    [0, 0.22].forEach((at) => {
      tone(c, { f: 420, f2: 200, dur: 0.14, type: 'sawtooth', vol: 0.2, lp: 1200, at });
      noise(c, { dur: 0.08, bp: 900, q: 0.8, vol: 0.2, at });
    });
  },
  echo: (c) => {
    [1, 0.5, 0.25, 0.12].forEach((v, i) => tone(c, { f: 300 - i * 25, f2: 250 - i * 25, dur: 0.28, vol: 0.2 * v, vib: 5, at: i * 0.32, lp: 900 }));
  },
  plop: (c) => tone(c, { f: 420, f2: 120, dur: 0.18, vol: 0.3 }),
  pop: (c) => tone(c, { f: 600, f2: 200, dur: 0.1, vol: 0.25 }),
};

async function loadFiles() {
  if (filesLoaded) return;
  filesLoaded = true;
  try {
    const res = await fetch('/sounds/manifest.json');
    if (res.ok) files = await res.json();
  } catch {
    /* tidak ada berkas rekaman, pakai suara buatan */
  }
}

export function playSound(name: string) {
  const c = audio();
  if (!c) return;
  void loadFiles();
  const file = files[name];
  if (file) {
    const a = new Audio(`/sounds/${file}`);
    a.volume = 0.9;
    a.play().catch(() => SYNTH[name]?.(c));
    return;
  }
  SYNTH[name]?.(c);
}

/** Mengucapkan kalimat pendek dengan suara bahasa Indonesia bila peramban mendukung. */
export function speak(text: string, fallback = 'boing') {
  if (!enabled) return;
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    playSound(fallback);
    return;
  }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  u.rate = 1;
  u.pitch = 1.3;
  synth.speak(u);
}
