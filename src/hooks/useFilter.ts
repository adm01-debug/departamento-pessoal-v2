// V15-451
import { useState, useMemo } from 'react';
export function useFilter<T>(data: T[], filterFn: (item: T, filters: Record<string, any>) => boolean) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const filteredData = useMemo(() => data.filter(item => filterFn(item, filters)), [data, filters, filterFn]);
  const setFilter = (key: string, value: any) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({});
  const hasFilters = Object.keys(filters).some(k => filters[k] !== undefined && filters[k] !== '');
  return { filteredData, filters, setFilter, clearFilters, hasFilters };
}
