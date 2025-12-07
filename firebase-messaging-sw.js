const CACHE_NAME = 'panetprova-v8520';
const urlsToCache = [
  '/panetprova/',
  '/panetprova/index.html',
  '/panetprova/logo.png',
  '/panetprova/manifest.json',
  '/panetprova/jhs.mp4,
];

self.addEventListener('install', function(e) {
  console.log('[SW] Installazione Service Worker');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets compreso il video');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[SW] Attivazione Service Worker');
  e.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(n => { if (n !== CACHE_NAME) caches.delete(n); }))
    )
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notifica cliccata');
  event.notification.close();
  event.waitUntil(clients.openWindow('/panetprova/'));
});

// -------- FIREBASE CLOUD MESSAGING --------
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  messagingSenderId: "363847145933",
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  projectId: "ordinipost-fcc7f",
  appId: "1:363847145933:web:d1590848833eb147590c84",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log("📦 Messaggio in background:", payload);
  const notificationTitle = payload.notification.title || 'Nuovo Messaggio';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/panetprova/logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
