// @ts-nocheck — service worker globals (self, caches, fetch events) come
// from the "webworker" lib, not the "dom" lib this project's tsconfig uses,
// and this file isn't part of tsconfig's include anyway (it's a static
// public/ asset, not part of the app bundle).
// Minimal service worker: gives the app installability (a fetch handler is
// one of the browser's install criteria alongside the manifest) and basic
// offline support for the app shell.
const CACHE_NAME = 'fx-checker-v2'
const APP_SHELL = ['/', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // A page can issue requests from browser extensions and third-party
  // scripts. CacheStorage only accepts HTTP(S) requests, and this app shell
  // cache should only contain resources from this origin.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Navigations: network-first, so users get the latest app shell whenever
  // they're online, falling back to the cached shell when they're not.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() =>
          caches.match(request).then((res) => res || caches.match('/')),
        ),
    )
    return
  }

  // Everything else (JS/CSS/images/fonts): cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
    }),
  )
})
