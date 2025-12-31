import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CRUDOptions<T> {
  /** Nome da tabela no Supabase */
  tableName: string;
  /** Colunas a selecionar (padrão: *) */
  select?: string;
  /** Coluna de ordenação padrão */
  orderBy?: { column: keyof T; ascending?: boolean };
  /** Filtros padrão */
  defaultFilters?: Record<string, unknown>;
  /** Incluir soft deleted? */
  includeSoftDeleted?: boolean;
  /** Nome da coluna de soft delete */
  softDeleteColumn?: string;
  /** Query keys adicionais para invalidar */
  additionalInvalidateKeys?: string[][];
  /** Mensagens customizadas */
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    error?: string;
  };
}

export interface CRUDFilters {
  search?: string;
  searchColumns?: string[];
  filters?: Record<string, unknown>;
  page?: number;
  pageSize?: number;
  orderBy?: { column: string; ascending?: boolean };
}

/**
 * Hook genérico para operações CRUD
 */
export function useCRUD<T extends { id: string }>(options: CRUDOptions<T>) {
  const {
    tableName,
    select = '*',
    orderBy,
    defaultFilters = {},
    includeSoftDeleted = false,
    softDeleteColumn = 'deleted_at',
    additionalInvalidateKeys = [],
    messages = {},
  } = options;

  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: [tableName] });
    additionalInvalidateKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  // ==================== READ ====================

  /**
   * Lista items com filtros, paginação e busca
   */
  const useList = (filters: CRUDFilters = {}) => {
    const {
      search,
      searchColumns = [],
      filters: customFilters = {},
      page = 1,
      pageSize = 20,
      orderBy: customOrderBy,
    } = filters;

    return useQuery({
      queryKey: [tableName, 'list', filters],
      queryFn: async () => {
        let query = supabase
          .from(tableName)
          .select(select, { count: 'exact' });

        // Aplicar filtros padrão
        Object.entries(defaultFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        // Aplicar filtros customizados
        Object.entries(customFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });

        // Filtrar soft deleted
        if (!includeSoftDeleted) {
          query = query.is(softDeleteColumn, null);
        }

        // Busca fulltext
        if (search && search.length >= 2 && searchColumns.length > 0) {
          const orConditions = searchColumns
            .map((col) => `${col}.ilike.%${search}%`)
            .join(',');
          query = query.or(orConditions);
        }

        // Ordenação
        const sortBy = customOrderBy || orderBy;
        if (sortBy) {
          query = query.order(String(sortBy.column), {
            ascending: sortBy.ascending ?? true,
          });
        }

        // Paginação
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
          data: data as T[],
          total: count ?? 0,
          page,
          pageSize,
          totalPages: Math.ceil((count ?? 0) / pageSize),
        };
      },
    });
  };

  /**
   * Busca um item por ID
   */
  const useGetById = (id: string | undefined) => {
    return useQuery({
      queryKey: [tableName, 'detail', id],
      queryFn: async () => {
        if (!id) return null;

        const { data, error } = await supabase
          .from(tableName)
          .select(select)
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as T;
      },
      enabled: !!id,
    });
  };

  // ==================== CREATE ====================

  const createMutation = useMutation({
    mutationFn: async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(messages.createSuccess || 'Item criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(messages.error || `Erro: ${error.message}`);
    },
  });

  // ==================== UPDATE ====================

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<T, 'id' | 'created_at'>>;
    }) => {
      const { data: updated, error } = await supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated as T;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(messages.updateSuccess || 'Item atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(messages.error || `Erro: ${error.message}`);
    },
  });

  // ==================== DELETE ====================

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(messages.deleteSuccess || 'Item excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(messages.error || `Erro: ${error.message}`);
    },
  });

  // ==================== SOFT DELETE ====================

  const softDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [softDeleteColumn]: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success('Item arquivado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [softDeleteColumn]: null })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success('Item restaurado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // ==================== BULK OPERATIONS ====================

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from(tableName).delete().in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      invalidateAll();
      toast.success(`${ids.length} itens excluídos!`);
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({
      ids,
      data,
    }: {
      ids: string[];
      data: Partial<Omit<T, 'id' | 'created_at'>>;
    }) => {
      const { error } = await supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      invalidateAll();
      toast.success(`${ids.length} itens atualizados!`);
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  return {
    // Queries
    useList,
    useGetById,

    // Mutations
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    delete: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    softDelete: softDeleteMutation.mutate,
    restore: restoreMutation.mutate,

    // Bulk
    bulkDelete: bulkDeleteMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,

    // Estados
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSoftDeleting: softDeleteMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isBulkDeleting: bulkDeleteMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,

    // Utilitários
    invalidateAll,
  };
}

export default useCRUD;
