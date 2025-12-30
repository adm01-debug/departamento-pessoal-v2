/**
 * @fileoverview Hook para gerenciamento de cargos
 * @module hooks/useCargos
 * @version V8.5
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  departamento_id?: string;
  nivel?: string;
  cbo?: string;
  salario_min?: number;
  salario_max?: number;
  ativo: boolean;
  created_at: string;
}

export function useCargos(departamentoId?: string) {
  const queryClient = useQueryClient();

  const { data: cargos = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['cargos', departamentoId],
    queryFn: async () => {
      let query = supabase.from('cargos').select('*').order('nome');
      if (departamentoId) {
        query = query.eq('departamento_id', departamentoId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Cargo[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (dados: Partial<Cargo>) => {
      const { data, error } = await supabase.from('cargos').insert(dados).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo criado!');
    },
    onError: () => toast.error('Erro ao criar cargo'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<Cargo> }) => {
      const { data, error } = await supabase.from('cargos').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo atualizado!');
    },
    onError: () => toast.error('Erro ao atualizar cargo'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cargos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo excluído!');
    },
    onError: () => toast.error('Erro ao excluir cargo'),
  });

  return {
    cargos,
    loading,
    error,
    refetch,
    createCargo: createMutation.mutateAsync,
    updateCargo: (id: string, dados: Partial<Cargo>) => updateMutation.mutateAsync({ id, dados }),
    deleteCargo: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useCargos;
