import { useState } from 'react';
import { go } from '../App';
import { api } from '../api';

const IDEAS = [
  'Kancil dan harimau yang ingin memangsanya di tepi hutan',
  'Kancil menipu buaya agar bisa menyeberangi sungai',
  'Kancil membantu petani menjaga kebun dari tikus',
];

export function Create() {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.generate(prompt);
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
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Kancil bertemu harimau yang lapar di hutan…"
          rows={5}
          maxLength={1000}
          disabled={busy}
        />
        <div className="ideas">
          {IDEAS.map((i) => (
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
