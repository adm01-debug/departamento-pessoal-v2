import { useCallback } from 'react';

interface NotificationOptions { body?: string; icon?: string; tag?: string; }

export function usePushNotification() {
  const send = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      return new Notification(title, options);
    }
    return null;
  }, []);

  return { send, isSupported: 'Notification' in window };
}
export default usePushNotification;
