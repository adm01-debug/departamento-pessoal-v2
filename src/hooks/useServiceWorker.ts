import { useState, useEffect, useCallback } from 'react';

export function useServiceWorker(swUrl: string = '/sw.js') {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swUrl).then(reg => {
        setRegistration(reg);
        reg.onupdatefound = () => setUpdateAvailable(true);
      });
    }
  }, [swUrl]);

  const update = useCallback(() => { registration?.update(); }, [registration]);

  return { registration, updateAvailable, update, isSupported: 'serviceWorker' in navigator };
}
export default useServiceWorker;
