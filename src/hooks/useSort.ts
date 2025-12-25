import { useState, useCallback, useMemo } from 'react';
type SortDir = 'asc' | 'desc';
interface SortConfig<T> { key: keyof T; direction: SortDir; }
export function useSort<T>(data: T[], defaultKey?: keyof T) {
  const [config, setConfig] = useState<SortConfig<T> | null>(defaultKey ? { key: defaultKey, direction: 'asc' } : null);
  const sorted = useMemo(() => {
    if (!config) return data;
    return [...data].sort((a, b) => {
      const va = a[config.key], vb = b[config.key];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return config.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, config]);
  const sort = useCallback((key: keyof T) => {
    setConfig(prev => ({ key, direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  }, []);
  return { sorted, config, sort };
}
