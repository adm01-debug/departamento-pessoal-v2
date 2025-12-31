import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  is_default: boolean;
  entity_type: string;
  created_at: string;
}

export interface CreateFilterInput {
  name: string;
  filters: Record<string, unknown>;
  is_default?: boolean;
}

/**
 * Hook para gerenciar filtros salvos por entidade
 * @param entityType - Tipo da entidade (ex: 'colaboradores', 'folha', 'ferias')
 */
export function useSavedFilters(entityType: string) {
  const queryClient = useQueryClient();

  // Buscar filtros salvos
  const { data: filters, isLoading, error } = useQuery({
    queryKey: ['saved-filters', entityType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_filters')
        .select('*')
        .eq('entity_type', entityType)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Se a tabela não existe, retorna array vazio
        if (error.code === '42P01') return [];
        throw error;
      }
      return data as SavedFilter[];
    },
  });

  // Obter filtro padrão
  const defaultFilter = filters?.find(f => f.is_default);

  // Salvar novo filtro
  const saveMutation = useMutation({
    mutationFn: async (input: CreateFilterInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('saved_filters')
        .insert({
          user_id: user.id,
          entity_type: entityType,
          name: input.name,
          filters: input.filters,
          is_default: input.is_default ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro salvo com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar filtro: ${error.message}`);
    },
  });

  // Atualizar filtro existente
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SavedFilter> & { id: string }) => {
      const { data, error } = await supabase
        .from('saved_filters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro atualizado!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar filtro: ${error.message}`);
    },
  });

  // Deletar filtro
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_filters')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro removido');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover filtro: ${error.message}`);
    },
  });

  // Definir filtro como padrão
  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Remove default de todos os filtros do mesmo tipo
      await supabase
        .from('saved_filters')
        .update({ is_default: false })
        .eq('entity_type', entityType)
        .eq('user_id', user.id);

      // Define novo default
      const { error } = await supabase
        .from('saved_filters')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
      toast.success('Filtro padrão definido');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao definir padrão: ${error.message}`);
    },
  });

  return {
    filters: filters ?? [],
    defaultFilter,
    isLoading,
    error,
    saveFilter: saveMutation.mutate,
    updateFilter: updateMutation.mutate,
    deleteFilter: deleteMutation.mutate,
    setDefault: setDefaultMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
