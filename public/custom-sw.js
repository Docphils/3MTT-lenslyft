importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

self.__WB_DISABLE_DEV_LOGS = true;
workbox.setConfig({ debug: false });

// Precache all injected assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Let the app tell an updated worker to take over.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Let the activated worker control open app windows.
workbox.core.clientsClaim();

// Optional: Cache API requests (custom TMDb or local API)
workbox.routing.registerRoute(
  ({ url }) => url.origin.includes('api.themoviedb.org'),
  new workbox.strategies.NetworkFirst()
);
