import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SolicitacaoAjuste {
  id: string;
  colaborador_id: string;
  empresa_id: string;
  data_ponto: string;
  hora_original: string | null;
  hora_sugerida: string;
  tipo_ponto: 'entrada' | 'saida';
  motivo: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
}

export function usePontoMelhorado(empresaId?: string, colaboradorId?: string) {
  const queryClient = useQueryClient();

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes-ajuste-ponto', empresaId, colaboradorId],
    enabled: !!empresaId,
    queryFn: async () => {
      let query = supabase
        .from('solicitacoes_ajuste_ponto')
        .select('*, colaborador:colaboradores(nome_completo)')
        .eq('empresa_id', empresaId!)
        .order('created_at', { ascending: false });

      if (colaboradorId) {
        query = query.eq('colaborador_id', colaboradorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const criarSolicitacao = useMutation({
    mutationFn: async (payload: Omit<SolicitacaoAjuste, 'id' | 'status' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('solicitacoes_ajuste_ponto')
        .insert({
          ...payload,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ajuste-ponto'] });
      toast.success('Solicitação de ajuste enviada para aprovação.');
    },
    onError: (e: Error) => toast.error(`Erro ao criar solicitação: ${e.message}`),
  });

  const responderSolicitacao = useMutation({
    mutationFn: async ({ id, status, observacoes }: { id: string; status: 'aprovado' | 'rejeitado'; observacoes?: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('solicitacoes_ajuste_ponto')
        .update({
          status,
          observacoes_gestor: observacoes,
          aprovado_por: user.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ajuste-ponto'] });
      toast.success(`Solicitação ${variables.status === 'aprovado' ? 'aprovada' : 'rejeitada'} com sucesso.`);
    },
    onError: (e: Error) => toast.error(`Erro ao responder solicitação: ${e.message}`),
  });

  return {
    solicitacoes,
    isLoading,
    criarSolicitacao,
    responderSolicitacao
  };
}
