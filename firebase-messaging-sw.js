const CACHE_NAME = 'panetprova-v53'; // Cambiato per forzare l'aggiornamento immediato
const urlsToCache = [
  '/panetprova/',
  '/panetprova/index.html',
  '/panetprova/logo.png',
  '/panetprova/manifest.json'
  // Rimosso jhs.mp4
];

self.addEventListener('install', function(e) {
  self.skipWaiting(); // Forza l'installazione immediata del nuovo SW
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(names => Promise.all(
      names.map(n => { if (n !== CACHE_NAME) return caches.delete(n); })
    ))
  );
  return self.clients.claim(); // Prende il controllo immediato della pagina
});

self.addEventListener('fetch', function(e) {
  // Strategia Network-First per la navigazione (index.html) e chiamate API (Google Script)
  if (e.request.mode === 'navigate' || e.request.url.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // Strategia Stale-While-Revalidate per immagini e asset
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        const fetchPromise = fetch(e.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResponse.clone()));
          return networkResponse;
        }).catch(() => {}); // Ignora errori se offline
        
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// -------- FIREBASE CLOUD MESSAGING --------
// ... (Lascia invariata tutta la tua parte Firebase qui sotto) ...
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
// ... resto del tuo codice firebase ...
