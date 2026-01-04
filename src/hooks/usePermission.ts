import { useState, useEffect, useCallback, useRef } from "react";
export function usePermission<T = any>(initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const reset = useCallback(() => { setValue(initialValue); setError(null); }, [initialValue]);
  const execute = useCallback(async (fn: () => Promise<T>) => { setLoading(true); setError(null); try { const result = await fn(); setValue(result); return result; } catch (e) { setError(e as Error); throw e; } finally { setLoading(false); } }, []);
  return { value, setValue, loading, error, reset, execute };
}
export default usePermission;
