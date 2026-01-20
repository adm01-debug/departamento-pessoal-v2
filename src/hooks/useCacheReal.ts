// V18-H010: Hook Cache Strategy
import { useState, useCallback, useEffect } from "react";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function useCacheReal<T>(key: string, ttl: number = 300000) {
  const [data, setData] = useState<T | null>(null);
  const [isStale, setIsStale] = useState(false);

  const get = useCallback((): T | null => {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;
    const cached = JSON.parse(item) as CacheItem<T>;
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    setIsStale(isExpired);
    return cached.data;
  }, [key]);

  const set = useCallback((value: T) => {
    const item: CacheItem<T> = { data: value, timestamp: Date.now(), ttl };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    setData(value);
    setIsStale(false);
  }, [key, ttl]);

  const clear = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
    setData(null);
  }, [key]);

  const clearAll = useCallback(() => {
    Object.keys(localStorage).filter(k => k.startsWith("cache_")).forEach(k => localStorage.removeItem(k));
  }, []);

  useEffect(() => {
    const cached = get();
    if (cached) setData(cached);
  }, [get]);

  return { data, isStale, get, set, clear, clearAll };
}

export default useCacheReal;
