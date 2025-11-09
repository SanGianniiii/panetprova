self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('panetprova-v1').then(function(cache) {
      return cache.addAll([
        '/panetprova/',
        '/panetprova/index.html',
        '/panetprova/logo.png',
        '/panetprova/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/panetprova/')
  );
});
