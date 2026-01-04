import { useState, useMemo, useCallback } from "react";
export interface FilterConfig<T> { key: keyof T; type: "text" | "select" | "date" | "range" | "boolean"; }
export function useFilter<T extends Record<string, any>>(data: T[], configs: FilterConfig<T>[]) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const setFilter = useCallback((key: string, value: any) => setFilters(prev => ({ ...prev, [key]: value })), []);
  const clearFilter = useCallback((key: string) => setFilters(prev => { const { [key]: _, ...rest } = prev; return rest; }), []);
  const clearAllFilters = useCallback(() => setFilters({}), []);
  const filteredData = useMemo(() => data.filter(item => Object.entries(filters).every(([key, value]) => { if (value === undefined || value === null || value === "") return true; const itemValue = item[key]; if (typeof value === "string") return String(itemValue).toLowerCase().includes(value.toLowerCase()); return itemValue === value; })), [data, filters]);
  return { filteredData, filters, setFilter, clearFilter, clearAllFilters, activeFiltersCount: Object.keys(filters).length };
}
export default useFilter;
