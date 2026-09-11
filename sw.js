const CACHE = 'treino-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Imagens de exercícios: busca na rede, fallback no cache
  if (e.request.url.includes('.gif') || e.request.url.includes('.png') || e.request.url.includes('.jpg')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Resto: cache primeiro, depois rede
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
