// V15-141: src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  immediate?: boolean;
  cache?: boolean;
}

const cache = new Map<string, any>();

export function useFetch<T>(
  url: string,
  options?: RequestInit & UseFetchOptions
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: options?.cache ? cache.get(url) ?? null : null,
    loading: options?.immediate !== false && !cache.has(url),
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (options?.cache) cache.set(url, data);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [url, options]);

  useEffect(() => {
    if (options?.immediate !== false && !cache.has(url)) {
      fetchData();
    }
  }, [url, fetchData, options?.immediate]);

  return { ...state, refetch: fetchData };
}

export function clearFetchCache(url?: string): void {
  if (url) cache.delete(url);
  else cache.clear();
}
