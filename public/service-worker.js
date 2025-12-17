const CACHE_NAME = 'potolokforlife-v1.2';
const ID = 'potolokforlife';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/browserconfig.xml',
  '/icon.svg',
  '/icon-16.png',
  '/icon-32.png',
  '/icon-70.png',
  '/icon-144.png',
  '/icon-150.png',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-310.png',
  '/icon-512.png'
];

// Установка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[PWA ${ID}] Кэширование файлов...`);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log(`[PWA ${ID}] Установлен`);
        return self.skipWaiting();
      })
  );
});

// Активация
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log(`[PWA ${ID}] Удаление старого кэша: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log(`[PWA ${ID}] Активирован`);
      return self.clients.claim();
    })
  );
});

// Fetch
self.addEventListener('fetch', event => {
  // Игнорируем Chrome extensions и другие не-http запросы
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log(`[PWA ${ID}] Запрос из кэша: ${event.request.url}`);
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Кэшируем только успешные GET запросы
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error(`[PWA ${ID}] Fetch failed: ${error}`);
            // Можно вернуть кастомную offline страницу
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Сообщения
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
