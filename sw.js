const CACHE = "relic-trails-v1";
const FILES = [
    "/", "/index.html", "/styles.css", "/app.js", "/manifest.json",
    "/assets/welcome/welcome.png", "/assets/expeditions/wager.png",
    "/assets/expeditions/yellow.png", "/assets/expeditions/blue.png",
    "/assets/expeditions/white.png", "/assets/expeditions/green.png",
    "/assets/expeditions/red.png", "/assets/expeditions/purple.png"
];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});