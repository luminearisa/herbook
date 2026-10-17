import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { Reader } from './pages/Reader';
import { Create } from './pages/Create';
import { InstallBanner, InstallButton } from './InstallPrompt';

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export function go(path: string) {
  window.location.hash = path;
}

export function App() {
  const route = useHashRoute();
  const book = route.match(/^\/buku\/([a-z0-9-]+)$/);

  return (
    <div className="app">
      <header className="topbar">
        <a href="#/" className="brand" aria-label="Her Book, beranda">
          <span className="brand-mark" aria-hidden>
            <svg viewBox="0 0 32 32" width="30" height="30">
              <rect width="32" height="32" rx="9" fill="#2f6b4f" />
              <path d="M7 9.5c3-1.2 6-1 9 .8v13c-3-1.8-6-2-9-.8z" fill="#ffd479" />
              <path d="M25 9.5c-3-1.2-6-1-9 .8v13c3-1.8 6-2 9-.8z" fill="#ffb347" />
            </svg>
          </span>
          Her Book
        </a>
        <nav>
          <a href="#/" className={route === '/' ? 'active' : ''}>Perpustakaan</a>
          <a href="#/baru" className={route === '/baru' ? 'active' : ''}>+ Buku Baru</a>
          <InstallButton />
        </nav>
      </header>
      <main>
        {book ? <Reader slug={book[1]} key={book[1]} /> : route === '/baru' ? <Create /> : <Home />}
      </main>
      <footer className="footer">Her Book · cerita bergambar untuk dibaca bersama</footer>
      <InstallBanner />
    </div>
  );
}
