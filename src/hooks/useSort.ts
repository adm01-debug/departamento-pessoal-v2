// V15-450
import { useState, useMemo } from 'react';
import type { SortConfig, SortOrder } from '@/types';
export function useSort<T>(data: T[], initialSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(initialSort);
  const sortedData = useMemo(() => { if (!sortConfig) return data; return [...data].sort((a, b) => { const aVal = (a as any)[sortConfig.field]; const bVal = (b as any)[sortConfig.field]; if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1; if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1; return 0; }); }, [data, sortConfig]);
  const sort = (field: string) => { setSortConfig(prev => ({ field, order: prev?.field === field && prev.order === 'asc' ? 'desc' : 'asc' })); };
  return { sortedData, sortConfig, sort };
}
