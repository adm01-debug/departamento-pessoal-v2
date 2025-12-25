import { useState, useCallback, useEffect } from 'react';
export function useSessionStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : initial; } catch { return initial; }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue(prev => { const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v; sessionStorage.setItem(key, JSON.stringify(next)); return next; });
  }, [key]);
  const remove = useCallback(() => { sessionStorage.removeItem(key); setValue(initial); }, [key, initial]);
  return [value, set, remove] as const;
}
