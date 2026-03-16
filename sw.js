const CACHE_NAME = "junts-cabrils-v42";

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

"/web/manifest.json",
"/web/favicon.png",
"/web/icona-192.png",
"/web/icona-512.png",

"/web/marta.png"

];



self.addEventListener("install", (event) => {

self.skipWaiting();

event.waitUntil(

caches.open(CACHE_NAME)

.then((cache) => {

return cache.addAll(urlsToCache);

})

);

});



self.addEventListener("activate", (event) => {

self.clients.claim();

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

});



self.addEventListener("fetch", (event) => {

const requestUrl = new URL(event.request.url);



if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;



event.respondWith(

caches.match(event.request)

.then((response) => {

if (response) {

return response;

}



return fetch(event.request)

.then((networkResponse) => {

return caches.open(CACHE_NAME).then((cache) => {

cache.put(event.request, networkResponse.clone());

return networkResponse;

});

});

})

);

});
