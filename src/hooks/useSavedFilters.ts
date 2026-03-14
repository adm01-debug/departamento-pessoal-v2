import { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  is_default?: boolean;
  isDefault?: boolean;
}

export function useSavedFilters(entityType: string) {
  const [filters, setFilters] = useLocalStorage<SavedFilter[]>(`saved-filters-${entityType}`, []);
  const [isSaving, setIsSaving] = useState(false);
  const isLoading = false;

  const saveFilter = useCallback((data: { name: string; filters: Record<string, any>; is_default?: boolean }) => {
    const newFilter: SavedFilter = { id: Date.now().toString(), name: data.name, filters: data.filters, is_default: data.is_default };
    setFilters(prev => [...(prev || []), newFilter]);
  }, [setFilters]);

  const deleteFilter = useCallback((id: string) => {
    setFilters(prev => (prev || []).filter(f => f.id !== id));
  }, [setFilters]);

  const setDefault = useCallback((id: string) => {
    setFilters(prev => (prev || []).map(f => ({ ...f, is_default: f.id === id })));
  }, [setFilters]);

  return { filters: filters || [], isLoading, isSaving, saveFilter, deleteFilter, setDefault };
}
