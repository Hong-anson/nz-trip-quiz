const CACHE_NAME = 'nz-quiz-v8';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './bg.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  // 強制立即接管控制權，加快更新速度
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'nz-sync-reminder') {
    event.waitUntil(
      self.registration.showNotification('🇳🇿 紐西蘭大會考提示', {
        body: '偵測到網路已連線！請點擊此處回到 App 同步你的成績。',
        badge: './manifest.json', 
        tag: 'nz-sync-status',
        renotify: true,
        requireInteraction: true
      })
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});