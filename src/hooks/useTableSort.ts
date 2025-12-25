import { useState, useMemo, useCallback } from 'react';
type Dir = 'asc' | 'desc' | null;
interface SortState<T> { key: keyof T | null; direction: Dir; }
export function useTableSort<T extends Record<string, unknown>>(data: T[]) {
  const [sort, setSort] = useState<SortState<T>>({ key: null, direction: null });
  const handleSort = useCallback((key: keyof T) => {
    setSort(prev => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: null };
    });
  }, []);
  const sorted = useMemo(() => {
    if (!sort.key || !sort.direction) return data;
    return [...data].sort((a, b) => {
      const va = a[sort.key!], vb = b[sort.key!];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);
  return { sorted, sort, handleSort };
}
