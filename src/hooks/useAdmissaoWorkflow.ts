import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useAdmissaoWorkflow(admissaoId?: string) {
  const queryClient = useQueryClient();
  const { empresaAtualId } = useEmpresas();

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['admissao-workflow', admissaoId],
    enabled: !!admissaoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows_execucoes')
        .select('*, workflow:workflows_definicoes(*), historico:workflows_historico(*)')
        .eq('entidade_id', admissaoId)
        .eq('entidade_tipo', 'admissao')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const iniciarWorkflow = useMutation({
    mutationFn: async (dados: { workflow_id: string }) => {
      const { data, error } = await supabase
        .from('workflows_execucoes')
        .insert({
          workflow_id: dados.workflow_id,
          empresa_id: empresaAtualId,
          entidade_id: admissaoId,
          entidade_tipo: 'admissao',
          status: 'em_andamento',
          metadata: { iniciado_em: new Date().toISOString() }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissao-workflow', admissaoId] });
      toast.success('Workflow de admissão iniciado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { workflow, isLoading, iniciarWorkflow };
}
