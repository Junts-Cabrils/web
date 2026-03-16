const CACHE_NAME = "junts-cabrils-v51";

const urlsToCache = [
  "/web/",
  "/web/index.html",
  "/web/marta.html",
  "/web/noticies.html",
  "/web/convocatories.html",
  "/web/informacio.html",
  "/web/presentacio.html",
  "/web/programa.html",
  "/web/equip.html",
  "/web/PROGRAMA23.pdf",
  "/web/informacio_cabrils.pdf",
  "/web/manifest.json",
  "/web/favicon.png",
  "/web/icona-192.png",
  "/web/icona-512.png",
  "/web/marta.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") {
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  if (
    url.pathname.endsWith(".html") ||
    url.pathname === "/web/" ||
    url.pathname === "/web"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
    })
  );
});
