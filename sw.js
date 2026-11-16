const CACHE = 'telesufler-offline-49402dfe938dfab6'
const FILES = ["apple-touch-icon.png","index-D7TfMywY.js","index-DqCRBtfY.css","favicon.svg","icons.svg","index.html","manifest.webmanifest","telesufler-mark.svg"]
const root = self.registration.scope
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(path => new Request(new URL(path, root), {cache:'reload'})))))
})
// No skipWaiting: an update must never interrupt an open reading or recording session.
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key=>key.startsWith('telesufler-offline-') && key!==CACHE).map(key=>caches.delete(key)))))
})
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || !url.href.startsWith(root)) return
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(new URL('index.html',root))) || fetch(event.request)))
    return
  }
  if (!FILES.some(path => new URL(path,root).href === url.href)) return
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request)) || fetch(event.request)))
})
