import { useState, useMemo, useCallback } from "react";
export type SortDirection = "asc" | "desc";
export interface SortConfig { key: string; direction: SortDirection; }
export function useSort<T extends Record<string, any>>(data: T[], defaultSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null);
  const requestSort = useCallback((key: string) => { let direction: SortDirection = "asc"; if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc"; setSortConfig({ key, direction }); }, [sortConfig]);
  const clearSort = useCallback(() => setSortConfig(null), []);
  const sortedData = useMemo(() => { if (!sortConfig) return data; return [...data].sort((a, b) => { const aVal = a[sortConfig.key]; const bVal = b[sortConfig.key]; if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1; if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1; return 0; }); }, [data, sortConfig]);
  return { sortedData, sortConfig, requestSort, clearSort };
}
export default useSort;
