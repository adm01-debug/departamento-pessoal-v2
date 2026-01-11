// V16-029: Custom Service Worker Extensions
// This file contains custom service worker logic

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Nova notificação',
    icon: '/pwa-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: 'explore', title: 'Ver', icon: '/check.png' },
      { action: 'close', title: 'Fechar', icon: '/close.png' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Sistema DP', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-operations') {
    event.waitUntil(syncPendingOperations());
  }
});

async function syncPendingOperations() {
  const db = await openDB();
  const pendingOps = await db.getAll('pending-operations');
  
  for (const op of pendingOps) {
    try {
      await fetch(op.url, {
        method: op.method,
        headers: op.headers,
        body: op.body,
      });
      await db.delete('pending-operations', op.id);
    } catch (error) {
      console.error('Sync failed for operation:', op.id);
    }
  }
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-dashboard-data') {
    event.waitUntil(updateDashboardData());
  }
});

async function updateDashboardData() {
  const cache = await caches.open('dashboard-data');
  try {
    const response = await fetch('/api/dashboard/summary');
    await cache.put('/api/dashboard/summary', response);
  } catch (error) {
    console.log('Background sync failed, will retry');
  }
}

console.log('Custom Service Worker loaded');
