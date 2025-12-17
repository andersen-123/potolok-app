// Service Worker для PotolokForLife PWA
const CACHE_NAME = 'potolok-cache-v1.0';
const urlsToCache = [
  '/potolok-app/',
  '/potolok-app/index.html',
  '/potolok-app/manifest.json',
  '/potolok-app/static/js/main.js',
  '/potolok-app/static/css/main.css'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Установка');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Установлен');
        return self.skipWaiting();
      })
  );
});

// Активация
self.addEventListener('activate', event => {
  console.log('[Service Worker] Активация');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Удаление старого кэша:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Используется кэш для:', event.request.url);
          return response;
        }
        
        console.log('[Service Worker] Запрос к сети:', event.request.url);
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Возвращаем fallback для навигационных запросов
            if (event.request.mode === 'navigate') {
              return caches.match('/potolok-app/index.html');
            }
          });
      })
  );
});

// Фоновые задачи
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
