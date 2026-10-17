import { useEffect, useState } from 'react';
import { go } from '../App';
import { changePassword, logout, updateProfile, useAuth } from '../auth';

export function Profil() {
  const { user, ready } = useAuth();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setWhatsapp(user.whatsapp);
    }
  }, [user]);

  if (!ready) return <p className="muted narrow section">Memuat…</p>;

  if (!user) {
    return (
      <section className="section narrow">
        <h1>Profil</h1>
        <p className="muted">
          Kamu sedang memakai Her Book <strong>tanpa akun</strong>. Semua fitur tetap bisa dipakai —
          riwayat bacamu tersimpan di perangkat ini.
        </p>
        <p className="muted">
          Buat akun kalau ingin riwayat tersimpan di server dan bisa dilanjutkan dari perangkat lain.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#/masuk">Masuk atau daftar</a>
          <a className="btn" href="#/">Ke rak buku</a>
        </div>
      </section>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    setProfileError('');
    try {
      await updateProfile({ name: name.trim(), whatsapp: whatsapp.trim() });
      setProfileMsg('Perubahan tersimpan.');
    } catch (err) {
      setProfileError((err as Error).message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg('');
    setPasswordError('');
    try {
      await changePassword(current, password);
      setCurrent('');
      setPassword('');
      setPasswordMsg('Kata sandi berhasil diganti.');
    } catch (err) {
      setPasswordError((err as Error).message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="section narrow">
      <h1>Profil</h1>
      <p className="muted">
        Masuk sebagai <strong>@{user.username}</strong> · {user.email}
      </p>

      <h2>Data diri</h2>
      <form className="auth-form" onSubmit={saveProfile}>
        <label className="field">
          <span>Nama</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
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
        <label className="field">
          <span>Username</span>
          <input value={user.username} disabled />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={user.email} disabled />
        </label>
        {profileMsg && <p className="note">{profileMsg}</p>}
        {profileError && <p className="error">{profileError}</p>}
        <button className="btn primary" type="submit" disabled={savingProfile}>
          {savingProfile ? 'Menyimpan…' : 'Simpan perubahan'}
        </button>
      </form>

      <h2 className="section">Ganti kata sandi</h2>
      <form className="auth-form" onSubmit={savePassword}>
        <label className="field">
          <span>Kata sandi saat ini</span>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="field">
          <span>Kata sandi baru</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        {passwordMsg && <p className="note">{passwordMsg}</p>}
        {passwordError && <p className="error">{passwordError}</p>}
        <button className="btn primary" type="submit" disabled={savingPassword}>
          {savingPassword ? 'Menyimpan…' : 'Ganti kata sandi'}
        </button>
      </form>

      <div className="hero-actions">
        <button
          className="btn"
          onClick={() => {
            void logout().then(() => go('/'));
          }}
        >
          Keluar dari akun
        </button>
      </div>
    </section>
  );
}
