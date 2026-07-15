// Kardian Daily Checklist — service worker (v3)
// Caches the app shell so the PWA can be installed and opened offline.
// Data (checklist entries) live in localStorage / Firestore, not in this cache.
//
// v2 change: HTML/navigation requests are now NETWORK-FIRST — the previously
// cache-first strategy meant devices that had installed the app once kept
// showing the old cached index.html even after a new version was deployed.
// Now every open fetches the latest deployed version first, and the cache is
// only used as an offline fallback. Static assets (icons, manifest) stay
// cache-first since they rarely change.
//
// v3 change: bumped cache name only, to make sure every installed device
// picks up the index.html fix for cross-device sync (a device's own clock
// was previously used to decide whether to accept a teammate's edit, which
// meant edits only reliably showed up when both people happened to have the
// app open at the same time).

const CACHE_NAME = 'kardian-checklist-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Take over immediately instead of waiting for all old tabs to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests.
  // Everything else (CDN scripts, Firestore, fonts) goes straight to the network.
  if (url.origin !== self.location.origin) return;

  const isHtml =
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/');

  if (isHtml) {
    // NETWORK-FIRST for the app itself: always try to fetch the newest
    // deployed version; fall back to cache only when offline.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // CACHE-FIRST for static assets (icons, manifest), refreshed in the background.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
