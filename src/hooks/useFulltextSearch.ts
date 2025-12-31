import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export interface SearchOptions {
  /** Colunas para buscar (se não informado, busca em todas) */
  columns?: string[];
  /** Número mínimo de caracteres para iniciar busca */
  minChars?: number;
  /** Tempo de debounce em ms */
  debounceMs?: number;
  /** Limite de resultados */
  limit?: number;
  /** Ordenação */
  orderBy?: { column: string; ascending?: boolean };
  /** Filtros adicionais */
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

/**
 * Hook para busca fulltext em múltiplas colunas
 * @param tableName - Nome da tabela no Supabase
 * @param options - Opções de configuração da busca
 */
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

      // Aplicar filtros adicionais
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      // Busca fulltext
      if (debouncedTerm && columns && columns.length > 0) {
        // Busca em colunas específicas usando OR
        const orConditions = columns
          .map(col => `${col}.ilike.%${debouncedTerm}%`)
          .join(',');
        query = query.or(orConditions);
      } else if (debouncedTerm) {
        // Se não especificou colunas, tenta buscar nas mais comuns
        const commonColumns = ['nome', 'name', 'descricao', 'description', 'titulo', 'title', 'email', 'cpf', 'codigo'];
        const orConditions = commonColumns
          .map(col => `${col}.ilike.%${debouncedTerm}%`)
          .join(',');
        query = query.or(orConditions);
      }

      // Ordenação
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      // Limite
      query = query.limit(limit);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        items: data as T[],
        count: count ?? 0,
      };
    },
    enabled: shouldSearch,
    staleTime: 30000, // 30 segundos de cache
  });

  const result = useMemo(() => ({
    data: data?.items ?? [],
    isLoading: shouldSearch && isLoading,
    error: error as Error | null,
    searchTerm,
    setSearchTerm,
    clearSearch,
    hasResults: (data?.items?.length ?? 0) > 0,
    totalCount: data?.count ?? 0,
  }), [data, isLoading, error, searchTerm, setSearchTerm, clearSearch, shouldSearch]);

  return result;
}

/**
 * Hook simplificado para busca local (client-side)
 */
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

    return items.filter(item =>
      searchKeys.some(key => {
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

/**
 * Função utilitária para highlight do termo buscado
 */
export function highlightSearchTerm(text: string, term: string): string {
  if (!term || term.length < 2) return text;

  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

/**
 * Componente para exibir texto com highlight
 */
export function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight || highlight.length < 2) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
