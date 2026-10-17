// Service worker Her Book: aplikasi tetap terbuka dan buku yang pernah dibaca tetap bisa dibaca tanpa internet.
const VERSION = 'v1';
const SHELL = `herbook-shell-${VERSION}`;
const ASSETS = `herbook-assets-${VERSION}`;
const DATA = `herbook-data-${VERSION}`;
const KEEP = [SHELL, ASSETS, DATA];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(request)) || (fallbackUrl && (await caches.match(fallbackUrl)));
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Font Google: simpan setelah pertama kali dimuat
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, ASSETS).catch(() => Response.error()));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DATA));
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, SHELL, '/'));
  } else if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else {
    event.respondWith(networkFirst(request, SHELL));
  }
});
