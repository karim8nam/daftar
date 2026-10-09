// نسخة الموبايل: بيحفظ ملفات البرنامج على الموبايل عشان يفتح حتى من غير نت بعد أول مرة.
// البيانات نفسها مش هنا (دي بتتحفظ على الموبايل وبتتزامن مع حسابك على السحابة).
// الصفحة نفسها: بنجيب أحدث نسخة من النت الأول (عشان التحديثات توصل على طول)، ولو مفيش نت بنفتح المحفوظة.
const CACHE = 'daftar-web-2.4.9-202610091317';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'supabase.js', 'qrcode.js', 'html2canvas.min.js', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // السحابة (Supabase) وأي حاجة برا: من النت على طول
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isPage) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res; })
      .catch(() => caches.match('index.html').then(r => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
});
