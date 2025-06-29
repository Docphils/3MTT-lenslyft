importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

self.__WB_DISABLE_DEV_LOGS = true;
workbox.setConfig({ debug: false });

// Precache all injected assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Optional: Cache API requests (custom TMDb or local API)
workbox.routing.registerRoute(
  ({ url }) => url.origin.includes('api.themoviedb.org'),
  new workbox.strategies.NetworkFirst()
);
