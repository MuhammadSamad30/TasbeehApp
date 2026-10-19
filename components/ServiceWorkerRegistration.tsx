'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch((error: unknown) => {
        if (!cancelled) console.warn('Tasbeeh offline support could not be enabled.', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
