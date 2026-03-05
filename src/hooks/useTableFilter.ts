// @ts-nocheck
import { useState, useMemo, useCallback } from 'react';
type Filters<T> = Partial<Record<keyof T, unknown>>;
export function useTableFilter<T extends Record<string, unknown>>(data: T[]) {
  const [filters, setFilters] = useState<Filters<T>>({});
  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K] | undefined) => {
    setFilters(prev => {
      if (value === undefined) { const { [key]: _, ...rest } = prev; return rest; }
      return { ...prev, [key]: value };
    });
  }, []);
  const clearFilters = useCallback(() => setFilters({}), []);
  const filtered = useMemo(() => {
    const keys = Object.keys(filters) as (keyof T)[];
    if (keys.length === 0) return data;
    return data.filter(item => keys.every(k => item[k] === filters[k]));
  }, [data, filters]);
  return { filtered, filters, setFilter, clearFilters, hasFilters: Object.keys(filters).length > 0 };
}
