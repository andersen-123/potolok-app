// Базовый Service Worker для PWA
const CACHE_NAME = 'potolok-pwa-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: установлен');
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: запрос', event.request.url);
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: активирован');
});
