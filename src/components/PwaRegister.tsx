'use client'

import { useEffect } from 'react'

// Registers the service worker (public/sw.js) that, together with
// public/manifest.json, makes the app installable as a PWA. Rendered once
// from the root document; a no-op on browsers without SW support.
function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.error('Service worker registration failed:', error)
    })
  }, [])

  return null
}

export default PwaRegister
