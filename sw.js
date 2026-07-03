const CACHE_NAME = 'treetop-ai-cache-v1.3.1'; // ★バージョンを変えることで超強力クリア発動
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  // インストール後すぐにアクティブにする
  self.skipWaiting();
});

// 超強力なキャッシュクリア処理
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 現在のCACHE_NAMEと異なるものは全て削除！
          if (cacheName !== CACHE_NAME) {
            console.log('Old cache deleted:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 新しいService Workerがすぐに制御を開始する
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // オフライン対応: ネットワークリクエストが失敗したらキャッシュを返す
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
