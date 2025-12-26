import { useState, useEffect } from 'react';
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(forced-colors: active)');
    setIsHighContrast(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isHighContrast;
}
