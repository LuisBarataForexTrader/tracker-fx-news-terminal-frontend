// Trading News Terminal — Service Worker for Push Notifications
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '🔴 Trading News Terminal';
  const body  = data.body  || 'High impact market news';
  const url   = data.url   || '/';
  const tag   = data.tag   || 'tnt-alert';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:  '/favicon-192x192.png',
      badge: '/favicon-32x32.png',
      data:  { url },
      tag,                        // replaces previous notification with same tag
      renotify: true,             // still vibrate/sound even on replacement
      requireInteraction: false,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus existing TNT tab if open
      const tnt = list.find(c => c.url.includes('tradingnewsterminal.com'));
      if (tnt) return tnt.focus();
      return clients.openWindow(url);
    })
  );
});
