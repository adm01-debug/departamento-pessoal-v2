import { useMemo } from 'react';
import { useTableSort } from './useTableSort';
import { useTableFilter } from './useTableFilter';
interface Opts { pageSize?: number; }
export function useTable<T extends Record<string, unknown>>(data: T[], opts: Opts = {}) {
  const { pageSize = 10 } = opts;
  const { sorted, sort, handleSort } = useTableSort(data);
  const { filtered, filters, setFilter, clearFilters, hasFilters } = useTableFilter(sorted);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const processedData = useMemo(() => filtered, [filtered]);
  return { data: processedData, sort, handleSort, filters, setFilter, clearFilters, hasFilters, totalPages, total: filtered.length };
}
