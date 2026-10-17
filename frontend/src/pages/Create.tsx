import { useState } from 'react';
import { go } from '../App';
import { api } from '../api';
import type { Category } from '../types';

const IDEAS: Record<Category, string[]> = {
  fabel: [
    'Singa dan tikus kecil yang saling menolong',
    'Kura-kura dan kelinci berlomba lari',
    'Semut yang rajin dan belalang yang malas',
  ],
  islami: [
    'Kisah Nabi Yunus dan ikan paus',
    'Kisah unta Nabi Saleh',
    'Kisah Ashabul Kahfi dan anjing yang setia',
  ],
  dongeng: [
    'Kancil dan harimau yang ingin memangsanya di tepi hutan',
    'Kancil menipu buaya agar bisa menyeberangi sungai',
    'Kancil membantu petani menjaga kebun dari tikus',
  ],
};

export function Create() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Category>('dongeng');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.generate(prompt, category);
      if (res.note) sessionStorage.setItem('herbook-note', res.note);
      go(`/buku/${res.book.slug}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <section className="section narrow">
      <h1>Buat buku baru</h1>
      <p className="muted">
        Ceritakan idenya dengan kata-katamu. Her Book akan menulis cerita, menyusun adegan, dan
        menggambarnya dalam SVG.
      </p>
      <form onSubmit={submit} className="create-form">
        <div className="tabs" role="radiogroup" aria-label="Jenis cerita">
          {([['dongeng', 'Dongeng'], ['fabel', 'Fabel'], ['islami', 'Kisah Islami']] as const).map(([k, label]) => (
            <button type="button" key={k} role="radio" aria-checked={category === k} className={'tab' + (category === k ? ' on' : '')} onClick={() => setCategory(k)} disabled={busy}>
              {label}
            </button>
          ))}
        </div>
        {category === 'islami' && (
          <p className="note">
            Kisah Islami hanya mengambil dari Al-Qur'an dan hadis shahih, dan tidak menggambar manusia
            (nabi dan sahabat); hanya hewan, alam, dan Ka'bah. Perlu ANTHROPIC_API_KEY di server.
          </p>
        )}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Kancil bertemu harimau yang lapar di hutan…"
          rows={5}
          maxLength={1000}
          disabled={busy}
        />
        <div className="ideas">
          {IDEAS[category].map((i) => (
            <button type="button" key={i} className="chip button" onClick={() => setPrompt(i)} disabled={busy}>
              {i}
            </button>
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" disabled={busy || prompt.trim().length < 5}>
          {busy ? 'Sedang menulis cerita…' : 'Buat ceritanya ✨'}
        </button>
      </form>
    </section>
  );
}
