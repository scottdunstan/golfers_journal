/* The Yardage Book — offline app shell.
   Bump CACHE_VERSION whenever you deploy a new app.js so phones pick it up. */
const CACHE_VERSION = "yb-v1";
const SHELL = ["./", "./index.html", "./app.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* App shell: cache-first with background refresh.
   Everything else (Supabase API, fonts): network, falling back to cache if present. */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  const isShell = url.origin === self.location.origin;
  if (isShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const refresh = fetch(event.request)
          .then((res) => {
            if (res && res.ok) caches.open(CACHE_VERSION).then((c) => c.put(event.request, res.clone()));
            return res;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
  }
});
