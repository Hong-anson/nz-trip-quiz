const CACHE_NAME = 'nz-quiz-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 安裝時快取檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 斷網時攔截請求，提供快取內容
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});