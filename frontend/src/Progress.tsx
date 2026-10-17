import { useProgress } from './progress';
import type { ProgressKind } from './types';

function pad(entry: { page: number; total: number }): string {
  return `${Math.min(entry.page, entry.total)}/${entry.total}`;
}

function ago(ts: number): string {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'baru saja';
  const m = s / 60;
  if (m < 60) return `${Math.round(m)} menit lalu`;
  const h = m / 60;
  if (h < 24) return `${Math.round(h)} jam lalu`;
  const d = h / 24;
  if (d < 7) return `${Math.round(d)} hari lalu`;
  const w = d / 7;
  if (w < 5) return `${Math.round(w)} minggu lalu`;
  return new Date(ts).toLocaleDateString('id-ID');
}

/** Label singkat kemajuan sebuah cerita/materi. */
export function progressText(entry?: { page: number; total: number; completed: boolean }): string {
  if (!entry) return 'Belum dibaca';
  if (entry.completed) return `✓ Selesai dibaca`;
  return `Terbaca ${pad(entry)}`;
}

/** Lencana kecil di pojok sampul: menandai mana yang sudah dibaca. */
export function ProgressBadge({ kind, slug }: { kind: ProgressKind; slug: string }) {
  const map = useProgress();
  const entry = map[`${kind}:${slug}`];
  if (!entry) return null;
  const done = entry.completed;
  return (
    <span className={'progress-badge' + (done ? ' done' : '')}>
      {done ? '✓ Selesai' : `📖 ${Math.min(entry.page, entry.total)}/${entry.total}`}
    </span>
  );
}

/** Tombol "lanjutkan" ke bacaan terakhir untuk satu jenis. */
export function ContinueButton({ kind, label }: { kind: ProgressKind; label: string }) {
  const map = useProgress();
  const latest = Object.entries(map)
    .map(([k, entry]) => {
      const [kKind, slug] = k.split(':');
      return { kind: kKind as ProgressKind, slug, entry };
    })
    .filter((r) => r.kind === kind)
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt)[0];

  if (!latest) return null;
  const base = kind === 'book' ? '/buku/' : '/sekitar/';
  const pct = latest.entry.completed ? 'selesai' : pad(latest.entry);
  return (
    <a className="btn primary" href={`#${base}${latest.slug}`}>
      ▶ {label} <small>({pct})</small>
    </a>
  );
}

/** Daftar riwayat baca terbaru. `titles` memetakan slug ke judul sebagai cadangan. */
export function Riwayat({
  titles = {},
  kind,
  limit = 6,
}: {
  titles?: Record<string, string>;
  kind?: ProgressKind;
  limit?: number;
}) {
  const map = useProgress();
  const rows = Object.entries(map)
    .map(([k, entry]) => {
      const [kKind, slug] = k.split(':');
      return { kind: kKind as ProgressKind, slug, entry };
    })
    .filter((r) => !kind || r.kind === kind)
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt)
    .slice(0, limit);

  if (!rows.length) return null;

  return (
    <section className="section">
      <h2>Terakhir dibaca</h2>
      <div className="riwayat">
        {rows.map(({ kind: k, slug, entry }) => (
          <a key={`${k}:${slug}`} className="riwayat-row" href={`#${k === 'book' ? '/buku/' : '/sekitar/'}${slug}`}>
            <span className="riwayat-icon" aria-hidden>
              {k === 'book' ? '📖' : '🌿'}
            </span>
            <span className="riwayat-main">
              <strong>{entry.title || titles[slug] || slug}</strong>
              <small className="muted">{ago(entry.updatedAt)}</small>
            </span>
            <span className={'riwayat-state' + (entry.completed ? ' done' : '')}>
              {progressText(entry)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
