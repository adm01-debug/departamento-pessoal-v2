import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
export function useQueryParams<T extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams) as T, [searchParams]);
  const setParam = useCallback((key: keyof T, value: string | null) => {
    setSearchParams(prev => {
      if (value === null) prev.delete(String(key));
      else prev.set(String(key), value);
      return prev;
    });
  }, [setSearchParams]);
  const clearParams = useCallback(() => setSearchParams({}), [setSearchParams]);
  return { params, setParam, clearParams, setSearchParams };
}
