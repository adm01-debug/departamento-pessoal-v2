/**
 * @fileoverview Hook para aprovação de férias
 * @module hooks/useFeriasAprovacao
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useFeriasAprovacao() {
  const queryClient = useQueryClient();

  const aprovarMutation = useMutation({
    mutationFn: async ({ feriasId, aprovadorId }: { feriasId: string; aprovadorId: string }) => {
      const { error } = await supabase.from('ferias').update({
        status: 'aprovada',
        aprovado_por: aprovadorId,
        data_aprovacao: new Date().toISOString(),
      }).eq('id', feriasId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast.success('Férias aprovadas!');
    },
    onError: () => toast.error('Erro ao aprovar férias'),
  });

  const rejeitarMutation = useMutation({
    mutationFn: async ({ feriasId, motivo }: { feriasId: string; motivo: string }) => {
      const { error } = await supabase.from('ferias').update({
        status: 'rejeitada',
        motivo_rejeicao: motivo,
      }).eq('id', feriasId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast.success('Férias rejeitadas');
    },
    onError: () => toast.error('Erro ao rejeitar férias'),
  });

  return {
    aprovar: aprovarMutation.mutateAsync,
    rejeitar: rejeitarMutation.mutateAsync,
    isAprovando: aprovarMutation.isPending,
    isRejeitando: rejeitarMutation.isPending,
  };
}

export default useFeriasAprovacao;
