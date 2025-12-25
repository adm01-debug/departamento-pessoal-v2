/**
 * @fileoverview Hook para atualizações otimistas
 * @module hooks/useOptimisticUpdate
 */
import { useState, useCallback } from 'react';

/** Estado do update otimista */
interface OptimisticState<T> {
  /** Dados atuais (incluindo otimistas) */
  data: T;
  /** Dados originais */
  originalData: T;
  /** Se está em estado otimista */
  isOptimistic: boolean;
  /** Se houve erro */
  isError: boolean;
}

/** Retorno do hook */
interface UseOptimisticUpdateResult<T> {
  /** Dados atuais */
  data: T;
  /** Se está em estado otimista */
  isOptimistic: boolean;
  /** Aplicar update otimista */
  applyOptimistic: (updater: (current: T) => T) => void;
  /** Confirmar update (sucesso da API) */
  confirm: (newData?: T) => void;
  /** Reverter update (erro da API) */
  rollback: () => void;
}

/**
 * Hook para atualizações otimistas de UI
 * @param initialData - Dados iniciais
 * @returns Funções e estado para updates otimistas
 * @example
 * ```tsx
 * const { data, applyOptimistic, confirm, rollback } = useOptimisticUpdate(items);
 * 
 * const handleDelete = async (id: string) => {
 *   applyOptimistic((items) => items.filter(i => i.id !== id));
 *   try {
 *     await deleteItem(id);
 *     confirm();
 *   } catch {
 *     rollback();
 *   }
 * };
 * ```
 */
export function useOptimisticUpdate<T>(initialData: T): UseOptimisticUpdateResult<T> {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    originalData: initialData,
    isOptimistic: false,
    isError: false,
  });

  const applyOptimistic = useCallback((updater: (current: T) => T) => {
    setState((prev) => ({
      ...prev,
      data: updater(prev.data),
      originalData: prev.isOptimistic ? prev.originalData : prev.data,
      isOptimistic: true,
      isError: false,
    }));
  }, []);

  const confirm = useCallback((newData?: T) => {
    setState((prev) => ({
      ...prev,
      data: newData ?? prev.data,
      originalData: newData ?? prev.data,
      isOptimistic: false,
      isError: false,
    }));
  }, []);

  const rollback = useCallback(() => {
    setState((prev) => ({
      ...prev,
      data: prev.originalData,
      isOptimistic: false,
      isError: true,
    }));
  }, []);

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    applyOptimistic,
    confirm,
    rollback,
  };
}
