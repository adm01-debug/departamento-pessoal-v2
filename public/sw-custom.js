const CACHE_NAME = 'bombon-dp-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// 1. Instalação e Cache de Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Ativação e Limpeza de Cache Antigo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Estratégia Fetch: NetworkFirst (para HTML) e CacheFirst (para Assets)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Evitar cache em chamadas de API do Supabase e Auth
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/auth/')) {
    return;
  }

  // Navegação: NetworkFirst
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Assets Estáticos: CacheFirst
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

// 4. Recebimento de Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Você tem uma nova notificação do Departamento Pessoal.',
      icon: 'https://raw.githubusercontent.com/lovable-dev/lovable-preview-assets/main/dp-icon-192.png',
      badge: 'https://raw.githubusercontent.com/lovable-dev/lovable-preview-assets/main/dp-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/notificacoes'
      },
      actions: [
        { action: 'open', title: 'Ver Detalhes' },
        { action: 'close', title: 'Fechar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Bombon DP', options)
    );
  } catch (e) {
    console.error('Erro ao processar push notification:', e);
  }
});

// 5. Clique na Notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
