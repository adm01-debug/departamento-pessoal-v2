import { useState, useEffect, useCallback, useRef } from "react";
export function useTimeout<T = any>(init?: T) {
  const [data, setData] = useState<T | null>(init ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef(true);
  useEffect(() => { ref.current = true; return () => { ref.current = false; }; }, []);
  const execute = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true); setError(null);
    try { const r = await fn(); if (ref.current) setData(r); return r; }
    catch (e) { if (ref.current) setError(e as Error); throw e; }
    finally { if (ref.current) setLoading(false); }
  }, []);
  return { data, loading, error, execute, setData };
}
export default useTimeout;
