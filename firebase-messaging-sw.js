// (NUOVO) Logica di caching da service-worker.js
const CACHE_NAME = 'ordini-post-test-v1'; // Nome della cache aggiornato
const urlsToCache = [
  '/PANETPROVA/',
  '/PANETPROVA/index.html',
  '/PANETPROVA/logo.png',
  '/PANETPROVA/manifest.json'
];

self.addEventListener('install', function(e) {
  console.log('[SW-TEST] Installazione Service Worker');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW-TEST] Caching assets');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Attiva il nuovo SW immediatamente
  );
});

self.addEventListener('activate', function(e) {
  console.log('[SW-TEST] Attivazione Service Worker');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW-TEST] Eliminazione vecchia cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Permette al nuovo SW di prendere il controllo immediatamente
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

// Gestione click notifica 
self.addEventListener('notificationclick', function(event) {
  console.log('[SW-TEST] Notifica cliccata', event.notification.tag);
  event.notification.close();

  // Aggiornata la URL di reindirizzamento al nuovo progetto /PANETPROVA/
  event.waitUntil(
    clients.openWindow('/PANETPROVA/');
  );
});


// -------- INIZIO LOGICA FIREBASE CLOUD MESSAGING --------

// Importa gli script Firebase, usando la stessa versione che hai in index.html
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");


// ⚠️ CONFIGURAZIONE FIREBASE (USA QUESTA SOLO PER TEST SE NON VUOI CREARE UN NUOVO PROGETTO)
// ALTRIMENTI AGGIORNA CON I DATI DEL TUO NUOVO PROGETTO FIREBASE DI TEST
firebase.initializeApp({
  messagingSenderId: "363847145933",
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  projectId: "ordinipost-fcc7f",
  appId: "1:363847145933:web:d1590848833eb147590c84",
});

// Ottieni l'istanza di Firebase Messaging
const messaging = firebase.messaging();

// Gestisci i messaggi FCM quando la tua app non è in primo piano (background/chiusa)
messaging.onBackgroundMessage((payload) => {
  console.log("📦 Messaggio in background (TEST):", payload);

  // Personalizza la notifica qui
  const notificationTitle = payload.notification.title || 'Nuovo Messaggio (TEST)';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/logo.png',
    data: payload.data, // Dati aggiuntivi che potresti aver inviato con il messaggio
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
