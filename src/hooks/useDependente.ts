// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Dependente {
  id: string;
  colaborador_id: string;
  nome: string;
  cpf: string | null;
  parentesco: string;
  data_nascimento: string;
  para_irrf: boolean | null;
  para_salario_familia: boolean | null;
  para_plano_saude: boolean | null;
  created_at: string;
}

export function useDependentes(colaboradorId: string) {
  return useQuery<Dependente[]>({
    queryKey: ['dependentes', colaboradorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dependentes')
        .select('*')
        .eq('colaborador_id', colaboradorId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!colaboradorId,
  });
}

export function useCreateDependente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Dependente, 'id' | 'created_at'>) => {
      const { data: result, error } = await supabase
        .from('dependentes')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dependentes', variables.colaborador_id] });
      toast.success('Dependente adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar dependente: ${error.message}`);
    },
  });
}

export function useUpdateDependente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      colaboradorId,
      data,
    }: {
      id: string;
      colaboradorId: string;
      data: Partial<Dependente>;
    }) => {
      const { data: result, error } = await supabase
        .from('dependentes')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dependentes', variables.colaboradorId] });
      toast.success('Dependente atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar dependente: ${error.message}`);
    },
  });
}

export function useDeleteDependente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, colaboradorId }: { id: string; colaboradorId: string }) => {
      const { error } = await supabase.from('dependentes').delete().eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dependentes', variables.colaboradorId] });
      toast.success('Dependente removido com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover dependente: ${error.message}`);
    },
  });
}
