// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export interface SearchOptions {
  columns?: string[];
  minChars?: number;
  debounceMs?: number;
  limit?: number;
  orderBy?: { column: string; ascending?: boolean };
  filters?: Record<string, unknown>;
}

export interface SearchResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  hasResults: boolean;
  totalCount: number;
}

export function useFulltextSearch<T extends Record<string, unknown>>(
  tableName: string,
  options: SearchOptions = {}
): SearchResult<T> {
  const {
    columns,
    minChars = 2,
    debounceMs = 300,
    limit = 50,
    orderBy,
    filters = {},
  } = options;

  const [searchTerm, setSearchTermState] = useState('');
  const debouncedTerm = useDebouncedValue(searchTerm, debounceMs);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTermState('');
  }, []);

  const shouldSearch = debouncedTerm.length >= minChars;

  const { data, isLoading, error } = useQuery({
    queryKey: ['fulltext-search', tableName, debouncedTerm, columns, filters, orderBy, limit],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*', { count: 'exact' });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      if (debouncedTerm && columns && columns.length > 0) {
        const orConditions = columns.map((col) => `${col}.ilike.%${debouncedTerm}%`).join(',');
        query = query.or(orConditions);
      } else if (debouncedTerm) {
        const commonColumns = [
          'nome',
          'name',
          'descricao',
          'description',
          'titulo',
          'title',
          'email',
          'cpf',
          'codigo',
        ];
        const orConditions = commonColumns.map((col) => `${col}.ilike.%${debouncedTerm}%`).join(',');
        query = query.or(orConditions);
      }

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      query = query.limit(limit);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        items: data as T[],
        count: count ?? 0,
      };
    },
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const result = useMemo(
    () => ({
      data: data?.items ?? [],
      isLoading: shouldSearch && isLoading,
      error: error as Error | null,
      searchTerm,
      setSearchTerm,
      clearSearch,
      hasResults: (data?.items?.length ?? 0) > 0,
      totalCount: data?.count ?? 0,
    }),
    [data, isLoading, error, searchTerm, setSearchTerm, clearSearch, shouldSearch]
  );

  return result;
}

export function useLocalSearch<T extends Record<string, unknown>>(
  items: T[],
  searchKeys: (keyof T)[],
  debounceMs = 200
) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebouncedValue(searchTerm, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedTerm || debouncedTerm.length < 2) return items;

    const lowerTerm = debouncedTerm.toLowerCase();

    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerTerm);
      })
    );
  }, [items, searchKeys, debouncedTerm]);

  return {
    searchTerm,
    setSearchTerm,
    clearSearch: () => setSearchTerm(''),
    filteredItems,
    hasResults: filteredItems.length > 0,
  };
}

export function highlightSearchTerm(text: string, term: string): string {
  if (!term || term.length < 2) return text;

  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}
