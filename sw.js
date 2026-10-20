// الصفحة بتفتح حتى من غير نت (آخر نسخة اتفتحت)، والطلبات اللي اتكتبت بتستنى على الموبايل لحد النت ما يرجع.
// دايمًا بيجيب من النت الأول (عشان أي تحديث للصفحة يوصل على طول)، ولو مفيش نت بيفتح المحفوظ.
// (اتصالات Supabase نفسها مش بتعدي من هنا — دي صفحات الموقع بس.)
const CACHE = 'emek-portal-0.24.0';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
