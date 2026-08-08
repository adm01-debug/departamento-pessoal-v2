// Hook de listagem paginada via cursor (keyset pagination, Etapa 59).
//
// Exemplo de uso do cursorPagination helper para consumir o P1-020 parseCursor
// do bridge em uma listagem real de folhas. Tabelas grandes (>100K rows)
// degradam com OFFSET — cursor pagination mantém performance constante.
//
// Este hook é usado como referência para migração de outros hooks de listagem.

import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { encodeCursor, decodeCursor } from '@/utils/cursorPagination';
import { useEmpresas } from './useEmpresas';
import type { PostgrestBuilder } from '@supabase/postgrest-js';

interface FolhaRow {
  id: string;
  competencia: string;
  status: string;
  total_bruto: number;
  total_liquido: number;
  created_at: string;
}

export interface FolhaCursorState {
  data: FolhaRow[];
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface FolhaCursorHandlers {
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
}

const PAGE_SIZE = 50;

/**
 * Hook de listagem paginada de folhas via cursor.
 *
 * Estratégia:
 *   1. Primeira página: sem cursor, busca os primeiros PAGE_SIZE rows
 *   2. Cursor retornado pelo bridge (`<column>:<value>` base64) é armazenado
 *   3. Próxima página: usa cursorToFilter para gerar `gt` filter no próximo request
 *   4. Fim: quando retorno < PAGE_SIZE, hasMore = false
 *
 * @param filtros Filtros estáticos aplicados em todas as páginas (empresa_id obrigatório)
 */
export function useFolhaCursor(filtros: Record<string, string | number | undefined> = {}): FolhaCursorState & FolhaCursorHandlers {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const [data, setData] = useState<FolhaRow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(async (currentCursor: string | null, append: boolean) => {
    if (!empresaAtual?.id) return;

    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      // Decodifica cursor (se houver) para gerar filtro gt no próximo request
      const cursorFilter = currentCursor ? decodeCursor(currentCursor) : null;

      const filters = [
        { column: 'empresa_id', op: 'eq', value: empresaAtual.id },
        ...(cursorFilter
          ? [{ column: cursorFilter.column, op: 'gt', value: cursorFilter.value }]
          : []),
      ];

      // Aplica filtros estáticos do caller
      for (const [key, value] of Object.entries(filtros)) {
        if (value === undefined) continue;
        filters.push({ column: key, op: 'eq', value });
      }

      // Chama bridge via supabase client (que roteia para external-db-bridge)
      const result = await supabase
        .from('folhas_pagamento')
        .select('id, competencia, status, total_bruto, total_liquido, created_at')
        .order('id', { ascending: true })
        .limit(PAGE_SIZE);

      // Adiciona filtros via .eq() e .gt()
      let query = result;
      for (const f of filters) {
        if (f.op === 'eq') query = query.eq(f.column, f.value);
        else if (f.op === 'gt') query = query.gt(f.column, f.value);
      }

      const response = await query;

      if (reqId !== requestIdRef.current) return; // request obsoleto

      const rows = (response.data ?? []) as FolhaRow[];

      if (append) {
        setData(prev => [...prev, ...rows]);
      } else {
        setData(rows);
      }

      // Gera próximo cursor se houver mais páginas
      if (rows.length >= PAGE_SIZE && rows.length > 0) {
        const last = rows[rows.length - 1];
        setCursor(encodeCursor('id', last.id));
        setHasMore(true);
      } else {
        setCursor(null);
        setHasMore(false);
      }
    } catch (err) {
      if (reqId !== requestIdRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (reqId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [empresaAtual?.id, filtros]);

  // Carga inicial ao montar / quando filtros mudam
  useEffect(() => {
    setData([]);
    setCursor(null);
    setHasMore(true);
    fetchPage(null, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    fetchPage(cursor, true);
  }, [hasMore, isLoading, cursor, fetchPage]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['folhas'] });
    setData([]);
    setCursor(null);
    setHasMore(true);
    fetchPage(null, false);
  }, [queryClient, fetchPage]);

  const reset = useCallback(() => {
    setData([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
  }, []);

  return { data, cursor, hasMore, isLoading, error, loadMore, refresh, reset };
}