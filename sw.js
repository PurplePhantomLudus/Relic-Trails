const CACHE_NAME = "relic-trails-final";
const ASSETS = [
  "/", "/index.html", "/style.css", "/script.js", "/manifest.json",
  "/assets/welcome/portada.png", "/assets/icons/lock.png",
  "/assets/expeditions/red.png", "/assets/expeditions/blue.png",
  "/assets/expeditions/green.png", "/assets/expeditions/yellow.png",
  "/assets/expeditions/white.png", "/assets/expeditions/purple.png",
  "/assets/cards/red/W.png", "/assets/cards/blue/W.png",
  "/assets/cards/green/W.png", "/assets/cards/yellow/W.png",
  "/assets/cards/white/W.png", "/assets/cards/purple/W.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});