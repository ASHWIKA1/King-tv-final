const CACHE_NAME = 'king24x7-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/directory.html',
  '/jobs.html',
  '/classifieds.html',
  '/obituaries.html',
  '/wishes.html',
  '/business-studies.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Use Network-First strategy for dynamically updated portal assets
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If valid response, update the cache copy in the background
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
});
