/**
 * @fileoverview Hook para gerenciamento de filtros
 * @module hooks/useFilter
 */
import { useState, useCallback, useMemo } from 'react';

type FilterValue = string | number | boolean | null | undefined;

interface UseFilterProps<T extends Record<string, FilterValue>> {
  initialFilters?: Partial<T>;
  defaultFilters?: T;
}

interface UseFilterReturn<T extends Record<string, FilterValue>> {
  filters: T;
  activeFiltersCount: number;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (filters: Partial<T>) => void;
  removeFilter: (key: keyof T) => void;
  clearFilters: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook para gerenciamento de filtros
 */
export function useFilter<T extends Record<string, FilterValue>>({
  initialFilters = {} as T,
  defaultFilters = {} as T,
}: UseFilterProps<T> = {}): UseFilterReturn<T> {
  const [filters, setFiltersState] = useState<T>({
    ...defaultFilters,
    ...initialFilters,
  } as T);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const removeFilter = useCallback((key: keyof T) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({} as T);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, [defaultFilters]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== null && value !== undefined && value !== ''
    ).length;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    activeFiltersCount,
    setFilter,
    setFilters,
    removeFilter,
    clearFilters,
    resetFilters,
    hasActiveFilters,
  };
}
