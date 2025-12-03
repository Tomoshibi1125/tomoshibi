self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

self.addEventListener("fetch", () => {
  // Network-first by default; extend caching later if desired.
});
