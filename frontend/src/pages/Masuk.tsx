import { useState } from 'react';
import { go } from '../App';
import { login, logout, register, useAuth } from '../auth';

export function Masuk() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  if (user) {
    return (
      <section className="section narrow">
        <h1>Halo, {user.name} 👋</h1>
        <p className="muted">
          Kamu sudah masuk sebagai <strong>@{user.username}</strong>. Riwayat baca tersimpan di akunmu
          dan bisa dibuka dari perangkat lain.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#/profil">Buka profil</a>
          <a className="btn" href="#/">Ke rak buku</a>
          <button
            className="btn"
            onClick={() => {
              void logout().then(() => go('/'));
            }}
          >
            Keluar
          </button>
        </div>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'masuk') {
        await login(identifier.trim(), password);
      } else {
        await register({
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          password,
          whatsapp: whatsapp.trim(),
        });
      }
      go('/');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <section className="section narrow">
      <h1>{mode === 'masuk' ? 'Masuk ke akunmu' : 'Buat akun baru'}</h1>
      <p className="muted">
        Tanpa akun pun riwayat baca tersimpan di perangkat ini. Dengan akun, riwayat tersimpan aman
        dan bisa dilanjutkan dari HP atau komputer lain.
      </p>

      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'masuk'}
          className={'tab' + (mode === 'masuk' ? ' on' : '')}
          onClick={() => {
            setMode('masuk');
            setError('');
          }}
        >
          Masuk
        </button>
        <button
          role="tab"
          aria-selected={mode === 'daftar'}
          className={'tab' + (mode === 'daftar' ? ' on' : '')}
          onClick={() => {
            setMode('daftar');
            setError('');
          }}
        >
          Daftar
        </button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {mode === 'daftar' && (
          <>
            <label className="field">
              <span>Nama</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama panggilan"
                autoComplete="name"
                required
                minLength={2}
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              <span>Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="huruf kecil, angka, atau _"
                autoComplete="username"
                pattern="[a-z0-9_]{3,30}"
                required
              />
            </label>
            <label className="field">
              <span>Nomor WA <small className="muted">(opsional)</small></span>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </>
        )}

        {mode === 'masuk' && (
          <label className="field">
            <span>Email atau username</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="nama@email.com atau username"
              autoComplete="username"
              required
            />
          </label>
        )}

        <label className="field">
          <span>Kata sandi</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Memproses…' : mode === 'masuk' ? 'Masuk' : 'Daftar & masuk'}
        </button>
      </form>
    </section>
  );
}
