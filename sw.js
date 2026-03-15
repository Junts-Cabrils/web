const CACHE_NAME = "junts-cabrils-v28";

const urlsToCache = [
  "/web/",
  "/web/index.html",
  "/web/marta.html",
  "/web/noticies.html",
  "/web/convocatories.html",
  "/web/informacio.html",
  "/web/presentacio.html",
  "/web/programa.html",
  "/web/PROGRAMA23.pdf",
  "/web/manifest.json",
  "/web/favicon.png",
  "/web/icona-192.png",
  "/web/icona-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== "GET") {
    return;
  }

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/web/index.html");
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
