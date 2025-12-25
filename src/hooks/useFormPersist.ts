/**
 * @fileoverview Hook para persistir estado de formulários
 * @module hooks/useFormPersist
 */
import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UseFormPersistOptions<T> {
  /** Chave única para o formulário */
  key: string;
  /** Valores do formulário */
  watch: T;
  /** Função para definir valores */
  setValue: (name: keyof T, value: T[keyof T]) => void;
  /** Se deve limpar ao submeter */
  clearOnSubmit?: boolean;
  /** Campos a excluir da persistência */
  exclude?: (keyof T)[];
}

/**
 * Hook para persistir dados de formulário no localStorage
 * @example
 * ```tsx
 * const { clear } = useFormPersist({
 *   key: 'colaborador-form',
 *   watch: form.watch(),
 *   setValue: form.setValue,
 * });
 * ```
 */
export function useFormPersist<T extends Record<string, unknown>>({
  key,
  watch,
  setValue,
  clearOnSubmit = true,
  exclude = [],
}: UseFormPersistOptions<T>) {
  const storageKey = `form-persist-${key}`;
  const [storedValue, setStoredValue, removeValue] = useLocalStorage<Partial<T> | null>(
    storageKey,
    null
  );

  // Restaurar valores salvos ao montar
  useEffect(() => {
    if (storedValue) {
      Object.entries(storedValue).forEach(([field, value]) => {
        if (!exclude.includes(field as keyof T)) {
          setValue(field as keyof T, value as T[keyof T]);
        }
      });
    }
  }, []); // Executar apenas uma vez ao montar

  // Salvar valores quando mudam
  useEffect(() => {
    const filteredValues = Object.entries(watch).reduce((acc, [field, value]) => {
      if (!exclude.includes(field as keyof T) && value !== undefined && value !== '') {
        acc[field as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as Partial<T>);

    if (Object.keys(filteredValues).length > 0) {
      setStoredValue(filteredValues);
    }
  }, [watch, setStoredValue, exclude]);

  const clear = useCallback(() => {
    removeValue();
  }, [removeValue]);

  return {
    /** Limpar dados persistidos */
    clear,
    /** Se há dados salvos */
    hasSavedData: storedValue !== null,
  };
}
