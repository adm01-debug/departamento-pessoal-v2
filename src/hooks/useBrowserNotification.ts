/**
 * @fileoverview Hook para notificações do navegador
 * @module hooks/useBrowserNotification
 */
import { useCallback, useEffect, useState } from 'react';

export function useBrowserNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return null;
    return new Notification(title, options);
  }, [permission]);

  return {
    permission,
    isSupported: 'Notification' in window,
    requestPermission,
    notify,
  };
}

export default useBrowserNotification;
