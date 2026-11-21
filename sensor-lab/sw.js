/* 感測器實驗室 Service Worker
 * - HTML 一律 network-first（之後常改版，不能卡在舊版），離線時才用快取
 * - 其他同網域靜態檔 stale-while-revalidate
 * - 跨網域（例如 MediaPipe 的 CDN、模型）完全不攔截，交給瀏覽器
 * 改版時把 VERSION 跟 index.html 裡的 APP_VERSION 一起改。
 */
const VERSION = "sl-2026.11.21-2";
const ASSETS = ["./", "./manifest.webmanifest", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => {
  // 不自動 skipWaiting：讓頁面顯示「有新版本，點我更新」，由使用者決定
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(ASSETS.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))));
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("sl-") && k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => {
  const d = e.data || {};
  if (d.type === "skip") self.skipWaiting();
  else if (d.type === "version" && e.ports && e.ports[0]) e.ports[0].postMessage({ version: VERSION });
});

function isHTML(req) {
  return req.mode === "navigate" || req.destination === "document" || (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 跨網域不碰
  if (!url.pathname.startsWith(new URL("./", self.location).pathname)) return;
  if (url.pathname.endsWith("/sw.js")) return;

  if (isHTML(req)) {
    // network-first；no-cache 讓瀏覽器一定回伺服器確認，不吃 HTTP 快取的舊版
    e.respondWith((async () => {
      const key = url.origin + url.pathname; // 網址上的 ?result= 等參數不進快取鍵
      try {
        const res = await fetch(req.url, { cache: "no-cache", credentials: "same-origin" });
        if (res && res.ok) { const c = await caches.open(VERSION); c.put(key, res.clone()); }
        return res;
      } catch (err) {
        const c = await caches.open(VERSION);
        return (await c.match(key)) || (await c.match("./")) || new Response("<!doctype html><meta charset=utf-8><body style='background:#0f1216;color:#e8ecf1;font:16px sans-serif;padding:24px'>目前離線，而且還沒有快取這一頁。連上網路後再開一次。", { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    })());
    return;
  }

  // 其他靜態檔：stale-while-revalidate
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const hit = await c.match(req);
    const net = fetch(req).then(res => { if (res && res.ok && res.type === "basic") c.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || new Response("", { status: 504 });
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || "./#pwa", self.location).href;
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of cs) { if ("focus" in c) { try { await c.focus(); return; } catch (_) {} } }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

// 預留：之後若在 NAS 架推播伺服器，送來的推播在這裡顯示
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "感測器實驗室", { body: d.body || "", icon: "icons/icon-192.png", data: { url: d.url || "./#pwa" } }));
});
