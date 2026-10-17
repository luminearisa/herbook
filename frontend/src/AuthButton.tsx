import { logout, useAuth } from './auth';

export function AuthButton() {
  const { user, ready } = useAuth();

  if (!ready) return <span className="auth-box muted">…</span>;

  if (user) {
    const first = user.name.split(' ')[0];
    return (
      <span className="auth-box">
        <span className="auth-hello" title={user.username}>👋 {first}</span>
        <button
          className="btn small"
          onClick={() => {
            void logout();
          }}
        >
          Keluar
        </button>
      </span>
    );
  }

  return (
    <a className="btn small" href="#/masuk">
      Masuk
    </a>
  );
}
