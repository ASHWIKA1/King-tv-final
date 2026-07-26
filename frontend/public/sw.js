const CACHE_NAME = 'kings-tv-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/icons/favicon-light.png',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Intercept Event
self.addEventListener('fetch', (e) => {
  // Only cache GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Clone response and cache it dynamically for offline reading
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Do not cache API endpoints or admin panels dynamically
          const url = e.request.url;
          if (!url.includes('/api/') && !url.includes('/admin')) {
            cache.put(e.request, resClone);
          }
        });
        return res;
      })
      .catch(() => {
        // Fall back to cache if network is down
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If offline and request is HTML, return basic offline fallback page
          const acceptHeader = e.request.headers.get('accept');
          if (acceptHeader && acceptHeader.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
