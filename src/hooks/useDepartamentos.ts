/**
 * @fileoverview Hook para gerenciamento de departamentos
 * @module hooks/useDepartamentos
 * @version V8.4
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// ============================================
// TIPOS
// ============================================

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  responsavel_id?: string;
  departamento_pai_id?: string;
  ativo: boolean;
  created_at: string;
  updated_at?: string;
  // Campos computados
  responsavel_nome?: string;
  departamento_pai_nome?: string;
  colaboradores_count?: number;
}

export interface DepartamentoFormData {
  nome: string;
  descricao?: string;
  codigo?: string;
  responsavel_id?: string;
  departamento_pai_id?: string;
  ativo?: boolean;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useDepartamentos() {
  const queryClient = useQueryClient();

  // Query principal
  const {
    data: departamentos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async (): Promise<Departamento[]> => {
      logger.info('[useDepartamentos] Carregando departamentos');

      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('nome');

      if (error) {
        logger.error('[useDepartamentos] Erro ao carregar', { error });
        throw error;
      }

      return data || [];
    },
    staleTime: 60000,
  });

  // Departamentos ativos
  const departamentosAtivos = departamentos.filter(d => d.ativo !== false);

  // Criar departamento
  const createMutation = useMutation({
    mutationFn: async (data: DepartamentoFormData): Promise<Departamento> => {
      logger.info('[useDepartamentos] Criando departamento', { nome: data.nome });

      const { data: created, error } = await supabase
        .from('departamentos')
        .insert({ ...data, ativo: data.ativo ?? true })
        .select()
        .single();

      if (error) throw error;
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar departamento');
    },
  });

  // Atualizar departamento
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DepartamentoFormData> }): Promise<void> => {
      logger.info('[useDepartamentos] Atualizando departamento', { id });

      const { error } = await supabase
        .from('departamentos')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar departamento');
    },
  });

  // Excluir departamento
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      logger.info('[useDepartamentos] Excluindo departamento', { id });

      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento excluído!');
    },
    onError: () => {
      toast.error('Erro ao excluir departamento');
    },
  });

  return {
    departamentos,
    departamentosAtivos,
    isLoading,
    error,
    refetch,
    createDepartamento: createMutation.mutate,
    updateDepartamento: updateMutation.mutate,
    deleteDepartamento: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useDepartamentos;
