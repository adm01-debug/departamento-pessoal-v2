import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DuplicateOptions<T> {
  /** Campos a serem excluídos da duplicação (ex: id, created_at) */
  excludeFields?: (keyof T)[];
  /** Campos a serem modificados (ex: nome -> "Cópia de...") */
  transformFields?: Partial<Record<keyof T, (value: T[keyof T]) => T[keyof T]>>;
  /** Campos a serem zerados */
  resetFields?: (keyof T)[];
  /** Callback após duplicação */
  onSuccess?: (original: T, duplicate: T) => void;
  /** Query keys para invalidar */
  invalidateQueries?: string[][];
}

/**
 * Hook para duplicar registros em qualquer tabela
 */
export function useDuplicate<T extends Record<string, unknown>>(
  tableName: string,
  options: DuplicateOptions<T> = {}
) {
  const queryClient = useQueryClient();

  const {
    excludeFields = ['id', 'created_at', 'updated_at'] as (keyof T)[],
    transformFields = {},
    resetFields = [],
    onSuccess,
    invalidateQueries = [[tableName]],
  } = options;

  const duplicateMutation = useMutation({
    mutationFn: async (original: T): Promise<T> => {
      // Criar cópia excluindo campos especificados
      const duplicate: Partial<T> = {};

      Object.keys(original).forEach((key) => {
        const k = key as keyof T;

        // Excluir campos
        if (excludeFields.includes(k)) return;

        // Aplicar transformação se existir
        if (transformFields[k]) {
          duplicate[k] = transformFields[k]!(original[k]);
        }
        // Resetar campos se especificado
        else if (resetFields.includes(k)) {
          duplicate[k] = null as T[keyof T];
        }
        // Copiar valor original
        else {
          duplicate[k] = original[k];
        }
      });

      // Inserir no banco
      const { data, error } = await supabase
        .from(tableName)
        .insert(duplicate)
        .select()
        .single();

      if (error) throw error;

      return data as T;
    },
    onSuccess: (duplicate, original) => {
      // Invalidar queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success('Registro duplicado com sucesso!');
      onSuccess?.(original, duplicate);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao duplicar: ${error.message}`);
    },
  });

  return {
    duplicate: duplicateMutation.mutate,
    duplicateAsync: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
    error: duplicateMutation.error,
  };
}

/**
 * Hook para duplicar com relacionamentos
 */
export function useDuplicateWithRelations<T extends Record<string, unknown>>(
  mainTable: string,
  relations: {
    table: string;
    foreignKey: string;
    excludeFields?: string[];
  }[],
  options: DuplicateOptions<T> = {}
) {
  const queryClient = useQueryClient();

  const duplicateMutation = useMutation({
    mutationFn: async (originalId: string): Promise<{ main: T; relations: Record<string, unknown[]> }> => {
      // 1. Buscar registro principal
      const { data: original, error: fetchError } = await supabase
        .from(mainTable)
        .select('*')
        .eq('id', originalId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Duplicar registro principal
      const mainDuplicate: Partial<T> = {};
      const excludeFields = options.excludeFields ?? ['id', 'created_at', 'updated_at'];

      Object.keys(original).forEach((key) => {
        if (!excludeFields.includes(key as keyof T)) {
          const k = key as keyof T;
          if (options.transformFields?.[k]) {
            mainDuplicate[k] = options.transformFields[k]!(original[key]);
          } else if (options.resetFields?.includes(k)) {
            mainDuplicate[k] = null as T[keyof T];
          } else {
            mainDuplicate[k] = original[key];
          }
        }
      });

      const { data: newMain, error: mainError } = await supabase
        .from(mainTable)
        .insert(mainDuplicate)
        .select()
        .single();

      if (mainError) throw mainError;

      // 3. Duplicar relacionamentos
      const relationResults: Record<string, unknown[]> = {};

      for (const relation of relations) {
        const { data: relatedRecords, error: relError } = await supabase
          .from(relation.table)
          .select('*')
          .eq(relation.foreignKey, originalId);

        if (relError) {
          console.error(`Erro ao buscar ${relation.table}:`, relError);
          continue;
        }

        if (!relatedRecords || relatedRecords.length === 0) continue;

        const excludeRelFields = relation.excludeFields ?? ['id', 'created_at', 'updated_at'];

        const duplicatedRelations = relatedRecords.map((record) => {
          const dup: Record<string, unknown> = {};
          Object.keys(record).forEach((key) => {
            if (!excludeRelFields.includes(key)) {
              dup[key] = key === relation.foreignKey ? newMain.id : record[key];
            }
          });
          return dup;
        });

        const { data: newRelations, error: insertError } = await supabase
          .from(relation.table)
          .insert(duplicatedRelations)
          .select();

        if (insertError) {
          console.error(`Erro ao duplicar ${relation.table}:`, insertError);
        } else {
          relationResults[relation.table] = newRelations ?? [];
        }
      }

      return {
        main: newMain as T,
        relations: relationResults,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainTable] });
      relations.forEach((rel) => {
        queryClient.invalidateQueries({ queryKey: [rel.table] });
      });
      toast.success('Registro e relacionamentos duplicados!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao duplicar: ${error.message}`);
    },
  });

  return {
    duplicate: duplicateMutation.mutate,
    duplicateAsync: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
  };
}

/**
 * Transformações comuns para duplicação
 */
export const duplicateTransforms = {
  /** Adiciona "Cópia de " ao início do valor */
  addCopyPrefix: (value: unknown) =>
    typeof value === 'string' ? `Cópia de ${value}` : value,

  /** Adiciona " (cópia)" ao final */
  addCopySuffix: (value: unknown) =>
    typeof value === 'string' ? `${value} (cópia)` : value,

  /** Adiciona timestamp ao valor */
  addTimestamp: (value: unknown) =>
    typeof value === 'string'
      ? `${value} - ${new Date().toLocaleString('pt-BR')}`
      : value,

  /** Incrementa número */
  incrementNumber: (value: unknown) =>
    typeof value === 'number' ? value + 1 : value,
};
