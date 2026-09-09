'use client'

import { useEffect } from 'react'

// Registers the service worker (public/sw.js) that, together with
// public/manifest.json, makes the app installable as a PWA. Rendered once
// from the root document; a no-op on browsers without SW support.
function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Keeping a service worker active during Vite development can serve a
    // stale app shell after the dev server stops, hiding source changes and
    // preventing HMR from reconnecting.
    if (import.meta.env.DEV) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
      return
    }

    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.error('Service worker registration failed:', error)
    })
  }, [])

  return null
}

export default PwaRegister
