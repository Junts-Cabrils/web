const CACHE_NAME = "junts-cabrils-v17";

const urlsToCache = [
  "/web/",
  "/web/index.html",
  "/web/marta.html",
  "/web/presentacio.html",
  "/web/programa.html",
  "/web/informacio.html",
  "/web/noticies.html",
  "/web/convocatories.html",
  "/web/manifest.json",
  "/web/favicon.png",
  "/web/icona-192.png",
  "/web/icona-512.png",
  "/web/PROGRAMA23.pdf",
  "/web/informacio_cabrils.pdf",
  "/web/marta-avui.pdf"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => cached);
    })
  );
});
