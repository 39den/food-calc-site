// Офлайн для «Еда калькулятор». HTML — всегда network-first (новая версия видна сразу),
// хэшированные ассеты — cache-first. Версия оболочки = хэш сборки (подставляет build_pwa.sh).
const V = '45a67ae93858', SHELL = 'shell-' + V, DATA = 'data-eda', IMG = 'img-eda';
// Подпуть: на туннеле SW в корне (scope «/», оболочка /app/), на GitHub Pages — scope /food-calc-site/.
const P = new URL(self.registration.scope).pathname.replace(/\/$/, ''), SUB = P !== '';
const ROOT = P + '/', HTML_SRC = SUB ? ROOT : '/app/';
self.addEventListener('install', (e) => e.waitUntil((async () => {
  const c = await caches.open(SHELL);
  const html = await (await fetch(HTML_SRC, { cache: 'reload' })).text();
  const assets = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]).filter((u) => SUB ? u.startsWith(ROOT) : !u.startsWith('/app'));
  await c.put(ROOT, new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } }));
  await c.addAll([...new Set([P + '/manifest.webmanifest', P + '/apple-touch-icon.png', ...assets])]).catch(() => {});
  await self.skipWaiting();
  // база и миниатюры — в фоне, не блокируя установку
  caches.open(DATA).then((d) => d.add(P + '/pwa/recipes.json')).catch(() => {});
  fetch(P + '/pwa/thumbs.json').then((r) => r.json()).then(async (list) => { const ic = await caches.open(IMG); for (let i = 0; i < list.length; i += 20) await Promise.all(list.slice(i, i + 20).map((u) => ic.match(u, { ignoreVary: true }).then((h) => h || ic.add(u)).catch(() => {}))); }).catch(() => {});
})()));
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('shell-') && k !== SHELL || /eda-v\d$/.test(k)) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
const isHtml = (req, u) => req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html') || u.pathname === ROOT || /^\/app(\/|$)/.test(u.pathname);
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  if (u.pathname.startsWith('/api/') || u.pathname === P + '/sw.js') return; // API: офлайн-слой в приложении
  if (u.pathname.startsWith('/img/')) return e.respondWith((async () => {
    const c = await caches.open(IMG); const hit = await c.match(e.request, { ignoreVary: true, ignoreSearch: true }); if (hit) return hit;
    try { const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }
    catch { return (await c.match(u.pathname.replace(/(-480)?\.webp$/, '-160.webp'))) || Response.error(); }
  })());
  if (u.pathname === P + '/pwa/recipes.json') return e.respondWith((async () => {
    const c = await caches.open(DATA);
    try { const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; } catch { return (await c.match(e.request, { ignoreVary: true, ignoreSearch: true })) || Response.error(); }
  })());
  if (isHtml(e.request, u)) return e.respondWith((async () => {
    try {
      const r = await fetch(e.request, { cache: 'no-store' });
      if (r.ok && (SUB ? u.pathname.startsWith(ROOT) : (u.pathname === '/' || /^\/app(\/|$)/.test(u.pathname))) && (r.headers.get('content-type') || '').includes('text/html')) (await caches.open(SHELL)).put(ROOT, r.clone());  // только HTML (на туннеле «/» — манифест Expo)
      return r;
    } catch { const c = await caches.open(SHELL); return (await c.match(ROOT, { ignoreVary: true })) || Response.error(); }  // офлайн: последняя оболочка
  })());
  e.respondWith((async () => {
    const c = await caches.open(SHELL); const hit = await c.match(e.request, { ignoreVary: true, ignoreSearch: true });
    if (hit && !(hit.headers.get('content-type') || '').includes('text/html')) return hit;   // HTML вместо шрифта/скрипта — битый кэш, перезапрашиваем
    try { const r = await fetch(e.request, hit ? { cache: 'reload' } : undefined); if (r.ok && /\/_expo\/|\/assets\//.test(u.pathname) && !(r.headers.get('content-type') || '').includes('text/html')) c.put(e.request, r.clone()); else if (hit) c.delete(e.request); return r; }
    catch { return Response.error(); }
  })());
});
