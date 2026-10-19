/* Bump these versions when changing the offline shell or cache behavior. */
const CACHE_PREFIX = 'tasbeeh-pwa';
const SHELL_CACHE = `${CACHE_PREFIX}-shell-v1`;
const STATIC_CACHE = `${CACHE_PREFIX}-static-v1`;
const ROOT_URL = new URL('/', self.location.origin).href;
const OFFLINE_URL = new URL('/offline.html', self.location.origin).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shellCache = await caches.open(SHELL_CACHE);
    const offlineCache = await caches.open(STATIC_CACHE);

    // Keep a useful fallback even if the initial shell request cannot complete.
    await offlineCache.addAll([
      '/offline.html',
      '/icon-192x192.png',
      '/icon-512x512.png',
    ]);

    // Store a real Next.js HTML document, then its linked route chunks and CSS.
    const response = await fetch(new Request(ROOT_URL, {
      headers: { Accept: 'text/html' },
      cache: 'reload',
    }));
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      throw new Error('The app shell could not be cached.');
    }

    const html = await response.clone().text();
    await shellCache.put(ROOT_URL, response);

    const linkedAssets = new Set();
    const assetPattern = /(?:src|href)=["']([^"']+)["']/g;
    for (const match of html.matchAll(assetPattern)) {
      try {
        const assetUrl = new URL(match[1], ROOT_URL);
        if (assetUrl.origin === self.location.origin && assetUrl.pathname.startsWith('/_next/static/')) {
          linkedAssets.add(assetUrl.href);
        }
      } catch {
        // Ignore malformed or non-URL attributes in generated HTML.
      }
    }

    await Promise.allSettled([...linkedAssets].map(async (assetUrl) => {
      const asset = await fetch(assetUrl, { cache: 'reload' });
      if (asset.ok) await offlineCache.put(assetUrl, asset);
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const currentCaches = new Set([SHELL_CACHE, STATIC_CACHE]);
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(`${CACHE_PREFIX}-`) && !currentCaches.has(name))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // Never cache Next.js RSC, prefetch, Server Action, or API traffic.
  if (
    request.headers.has('RSC') ||
    request.headers.has('Next-Action') ||
    request.headers.has('Next-Router-Prefetch') ||
    requestUrl.searchParams.has('_rsc') ||
    requestUrl.pathname.startsWith('/api/')
  ) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          const shellCache = await caches.open(SHELL_CACHE);
          await shellCache.put(requestUrl.href, response.clone());
        }
        return response;
      } catch {
        const shellCache = await caches.open(SHELL_CACHE);
        const cachedShell = await shellCache.match(requestUrl.href, { ignoreSearch: true, ignoreVary: true });
        if (cachedShell) return cachedShell;

        const staticCache = await caches.open(STATIC_CACHE);
        return (await staticCache.match(OFFLINE_URL)) || Response.error();
      }
    })());
    return;
  }

  if (requestUrl.pathname.startsWith('/_next/static/')) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
    return;
  }

  if (requestUrl.pathname === '/icon-192x192.png' || requestUrl.pathname === '/icon-512x512.png') {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
  }
});
