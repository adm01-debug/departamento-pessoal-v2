import { useState, useCallback } from 'react';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const request = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const checkPermission = useCallback(() => {
    if ('Notification' in window) setPermission(Notification.permission);
    return Notification.permission;
  }, []);

  return { permission, request, checkPermission, isGranted: permission === 'granted' };
}
export default useNotificationPermission;
