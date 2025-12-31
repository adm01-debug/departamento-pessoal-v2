import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  action: (items: T[]) => Promise<void>;
  confirmMessage?: string;
  variant?: 'default' | 'destructive';
}

export interface UseBulkActionsOptions<T> {
  /** Nome da tabela para invalidar queries */
  tableName: string;
  /** Ações disponíveis */
  actions?: Record<string, BulkAction<T>>;
  /** Callback após ação bem-sucedida */
  onSuccess?: () => void;
}

/**
 * Hook para gerenciar seleção e ações em lote
 */
export function useBulkActions<T extends { id: string }>(
  items: T[],
  options: UseBulkActionsOptions<T>
) {
  const { tableName, actions = {}, onSuccess } = options;
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Selecionar/deselecionar item
  const toggleSelect = useCallback((id: string, shiftKey?: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);

      if (shiftKey && lastSelectedId) {
        // Seleção em range com Shift
        const currentIndex = items.findIndex((item) => item.id === id);
        const lastIndex = items.findIndex((item) => item.id === lastSelectedId);

        if (currentIndex !== -1 && lastIndex !== -1) {
          const start = Math.min(currentIndex, lastIndex);
          const end = Math.max(currentIndex, lastIndex);

          for (let i = start; i <= end; i++) {
            newSet.add(items[i].id);
          }
        }
      } else {
        // Toggle normal
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      }

      return newSet;
    });

    setLastSelectedId(id);
  }, [items, lastSelectedId]);

  // Selecionar todos
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  // Desselecionar todos
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  // Toggle todos
  const toggleAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      clearSelection();
    } else {
      selectAll();
    }
  }, [selectedIds.size, items.length, clearSelection, selectAll]);

  // Items selecionados
  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  // Mutation para executar ação
  const executeMutation = useMutation({
    mutationFn: async ({
      actionKey,
      customAction,
    }: {
      actionKey?: string;
      customAction?: (items: T[]) => Promise<void>;
    }) => {
      const action = actionKey ? actions[actionKey]?.action : customAction;
      if (!action) throw new Error('Ação não encontrada');

      await action(selectedItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      clearSelection();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Erro na operação: ${error.message}`);
    },
  });

  // Executar ação predefinida
  const executeAction = useCallback(
    (actionKey: string) => {
      const action = actions[actionKey];
      if (!action) return;

      if (action.confirmMessage) {
        if (confirm(action.confirmMessage)) {
          executeMutation.mutate({ actionKey });
        }
      } else {
        executeMutation.mutate({ actionKey });
      }
    },
    [actions, executeMutation]
  );

  // Executar ação customizada
  const executeCustomAction = useCallback(
    (action: (items: T[]) => Promise<void>) => {
      executeMutation.mutate({ customAction: action });
    },
    [executeMutation]
  );

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    isSelected: (id: string) => selectedIds.has(id),
    toggleSelect,
    selectAll,
    clearSelection,
    toggleAll,
    isAllSelected: selectedIds.size === items.length && items.length > 0,
    isSomeSelected: selectedIds.size > 0 && selectedIds.size < items.length,
    hasSelection: selectedIds.size > 0,
    executeAction,
    executeCustomAction,
    isExecuting: executeMutation.isPending,
    availableActions: Object.entries(actions).map(([key, action]) => ({
      key,
      ...action,
    })),
  };
}

/**
 * Ações em lote comuns para Supabase
 */
export function createBulkSupabaseActions<T extends { id: string }>(
  tableName: string,
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    delete: {
      label: 'Excluir Selecionados',
      variant: 'destructive' as const,
      confirmMessage: 'Tem certeza que deseja excluir os itens selecionados?',
      action: async (items: T[]) => {
        const ids = items.map((item) => item.id);
        const { error } = await supabase
          .from(tableName)
          .delete()
          .in('id', ids);

        if (error) throw error;
        toast.success(`${items.length} itens excluídos`);
      },
    },

    softDelete: {
      label: 'Arquivar Selecionados',
      confirmMessage: 'Tem certeza que deseja arquivar os itens selecionados?',
      action: async (items: T[]) => {
        const ids = items.map((item) => item.id);
        const { error } = await supabase
          .from(tableName)
          .update({ deleted_at: new Date().toISOString() })
          .in('id', ids);

        if (error) throw error;
        toast.success(`${items.length} itens arquivados`);
      },
    },

    restore: {
      label: 'Restaurar Selecionados',
      action: async (items: T[]) => {
        const ids = items.map((item) => item.id);
        const { error } = await supabase
          .from(tableName)
          .update({ deleted_at: null })
          .in('id', ids);

        if (error) throw error;
        toast.success(`${items.length} itens restaurados`);
      },
    },

    updateField: (field: string, value: unknown, label: string) => ({
      label,
      action: async (items: T[]) => {
        const ids = items.map((item) => item.id);
        const { error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .in('id', ids);

        if (error) throw error;
        toast.success(`${items.length} itens atualizados`);
      },
    }),
  };
}

/**
 * Componente de checkbox para seleção
 */
export function BulkSelectCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate ?? false;
        }}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      {label && <span className="ml-2 text-sm">{label}</span>}
    </label>
  );
}
