const CACHE_NAME = 'nz-quiz-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './bg.jpg'
];

// 1. 安裝與快取靜態資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 2. 離線攔截與讀取快取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// 3. 【核心】背景同步：偵測手機恢復網路時觸發
self.addEventListener('sync', event => {
  if (event.tag === 'nz-sync-reminder') {
    event.waitUntil(
      // 發出手機原生通知
      self.registration.showNotification('🇳🇿 紐西蘭大會考提示', {
        body: '偵測到網路已連線！請點擊此處回到 App 同步你的成績給團長。',
        badge: './manifest.json', 
        tag: 'nz-sync-status',
        renotify: true,
        requireInteraction: true // 通知會一直停留在畫面上，直到使用者點擊
      })
    );
  }
});

// 4. 當使用者點擊手機通知時，自動將 App 畫面推到最前線
self.addEventListener('notificationclick', event => {
  event.notification.close(); // 關閉通知
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 如果網頁本來就開著，直接聚焦 (Focus) 該分頁
      for (let client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // 如果被關掉了，重新打開 App 網址
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});