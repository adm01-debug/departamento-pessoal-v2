import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SoftDeleteOptions {
  /** Nome da tabela */
  tableName: string;
  /** Coluna que marca a exclusão (padrão: deleted_at) */
  deletedAtColumn?: string;
  /** Query keys para invalidar após operação */
  invalidateQueries?: string[][];
  /** Callbacks */
  onDeleteSuccess?: (id: string) => void;
  onRestoreSuccess?: (id: string) => void;
  onPermanentDeleteSuccess?: (id: string) => void;
}

/**
 * Hook para gerenciar soft delete (exclusão lógica)
 */
export function useSoftDelete(options: SoftDeleteOptions) {
  const {
    tableName,
    deletedAtColumn = 'deleted_at',
    invalidateQueries = [[tableName]],
    onDeleteSuccess,
    onRestoreSuccess,
    onPermanentDeleteSuccess,
  } = options;

  const queryClient = useQueryClient();

  const invalidate = () => {
    invalidateQueries.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  // Soft delete (marca como excluído)
  const softDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [deletedAtColumn]: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      invalidate();
      toast.success('Item arquivado com sucesso');
      onDeleteSuccess?.(id);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao arquivar: ${error.message}`);
    },
  });

  // Restore (remove marcação de exclusão)
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [deletedAtColumn]: null })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      invalidate();
      toast.success('Item restaurado com sucesso');
      onRestoreSuccess?.(id);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao restaurar: ${error.message}`);
    },
  });

  // Permanent delete (exclusão física)
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      invalidate();
      toast.success('Item excluído permanentemente');
      onPermanentDeleteSuccess?.(id);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  // Bulk soft delete
  const bulkSoftDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [deletedAtColumn]: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      invalidate();
      toast.success(`${ids.length} itens arquivados`);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao arquivar: ${error.message}`);
    },
  });

  // Bulk restore
  const bulkRestoreMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [deletedAtColumn]: null })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      invalidate();
      toast.success(`${ids.length} itens restaurados`);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao restaurar: ${error.message}`);
    },
  });

  // Bulk permanent delete
  const bulkPermanentDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      invalidate();
      toast.success(`${ids.length} itens excluídos permanentemente`);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  return {
    // Single operations
    softDelete: softDeleteMutation.mutate,
    softDeleteAsync: softDeleteMutation.mutateAsync,
    restore: restoreMutation.mutate,
    restoreAsync: restoreMutation.mutateAsync,
    permanentDelete: permanentDeleteMutation.mutate,
    permanentDeleteAsync: permanentDeleteMutation.mutateAsync,

    // Bulk operations
    bulkSoftDelete: bulkSoftDeleteMutation.mutate,
    bulkRestore: bulkRestoreMutation.mutate,
    bulkPermanentDelete: bulkPermanentDeleteMutation.mutate,

    // Loading states
    isDeleting: softDeleteMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isPermanentDeleting: permanentDeleteMutation.isPending,
    isBulkDeleting: bulkSoftDeleteMutation.isPending,
    isBulkRestoring: bulkRestoreMutation.isPending,
    isBulkPermanentDeleting: bulkPermanentDeleteMutation.isPending,
  };
}

/**
 * Hook para gerenciar lixeira (itens excluídos)
 */
export function useTrash<T extends { id: string }>(
  tableName: string,
  options: {
    deletedAtColumn?: string;
    select?: string;
  } = {}
) {
  const { deletedAtColumn = 'deleted_at', select = '*' } = options;

  const {
    softDelete,
    restore,
    permanentDelete,
    bulkRestore,
    bulkPermanentDelete,
    isDeleting,
    isRestoring,
    isPermanentDeleting,
  } = useSoftDelete({ tableName });

  // Query para itens na lixeira
  const queryClient = useQueryClient();

  return {
    // Operações
    moveToTrash: softDelete,
    restoreFromTrash: restore,
    deletePermanently: permanentDelete,
    bulkRestore,
    bulkDeletePermanently: bulkPermanentDelete,

    // Estados
    isDeleting,
    isRestoring,
    isPermanentDeleting,

    // Refresh
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      queryClient.invalidateQueries({ queryKey: [tableName, 'trash'] });
    },
  };
}

export default useSoftDelete;
