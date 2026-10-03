// Service worker SOLO para la PWA de clientes (scope /cliente/). Nunca cachea /admin ni /api.
const CACHE = "cliente-v1";
const OFFLINE = new Response(
  '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión</title><body style="font-family:sans-serif;text-align:center;padding:3rem;color:#0D47A1"><h2>Sin conexión</h2><p>Revise su internet e intente nuevamente.</p>',
  { headers: { "Content-Type": "text/html; charset=utf-8" } },
);

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())),
);

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/admin")) return;

  // Estáticos: cache primero
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons")) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)); return res; })),
    );
    return;
  }
  // Navegación: red primero, aviso sin conexión como respaldo
  if (req.mode === "navigate") e.respondWith(fetch(req).catch(() => OFFLINE.clone()));
});
