import { useCallback, useState, useEffect } from 'react';
export function useBrowserNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  useEffect(() => { if ('Notification' in window) setPermission(Notification.permission); }, []);
  const requestPermission = useCallback(async () => { if ('Notification' in window) { const result = await Notification.requestPermission(); setPermission(result); return result; } return 'denied'; }, []);
  const notify = useCallback((title: string, options?: NotificationOptions) => { if (permission === 'granted') new Notification(title, options); }, [permission]);
  return { permission, requestPermission, notify };
}
