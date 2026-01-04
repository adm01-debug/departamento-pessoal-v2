import { useState, useEffect, useCallback, useRef } from "react";

export interface useAriaExpandedOptions { enabled?: boolean; debounce?: number; }
export interface useAriaExpandedResult<T = any> { data: T | null; loading: boolean; error: Error | null; }

export function useAriaExpanded<T = any>(initialValue?: T, options: useAriaExpandedOptions = {}) {
  const [data, setData] = useState<T | null>(initialValue ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const execute = useCallback(async (fn: () => Promise<T>) => {
    if (!options.enabled && options.enabled !== undefined) return;
    setLoading(true);
    setError(null);
    try { const result = await fn(); if (mountedRef.current) { setData(result); } return result; }
    catch (e) { if (mountedRef.current) { setError(e as Error); } throw e; }
    finally { if (mountedRef.current) { setLoading(false); } }
  }, [options.enabled]);

  const reset = useCallback(() => { setData(initialValue ?? null); setError(null); setLoading(false); }, [initialValue]);

  return { data, loading, error, execute, reset, setData };
}

export default useAriaExpanded;
