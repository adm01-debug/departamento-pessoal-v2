import { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  isDefault?: boolean;
}

export function useSavedFilters(entityType: string) {
  const [filters, setFilters] = useLocalStorage<SavedFilter[]>(`saved-filters-${entityType}`, []);
  const [isLoading, setIsLoading] = useState(false);

  const saveFilter = useCallback((name: string, filterValues: Record<string, any>) => {
    const newFilter: SavedFilter = { id: Date.now().toString(), name, filters: filterValues };
    setFilters(prev => [...(prev || []), newFilter]);
  }, [setFilters]);

  const deleteFilter = useCallback((id: string) => {
    setFilters(prev => (prev || []).filter(f => f.id !== id));
  }, [setFilters]);

  const setDefaultFilter = useCallback((id: string) => {
    setFilters(prev => (prev || []).map(f => ({ ...f, isDefault: f.id === id })));
  }, [setFilters]);

  return { filters: filters || [], isLoading, saveFilter, deleteFilter, setDefaultFilter };
}
