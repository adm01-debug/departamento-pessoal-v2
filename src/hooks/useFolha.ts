import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import { toast } from 'sonner';

export function useFolha(competencia?: string) {
  const { empresaAtualId } = useEmpresas();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['folhas', empresaAtualId, competencia],
    enabled: !!empresaAtualId,
    queryFn: async () => {
      let q = supabase
        .from('folhas_pagamento')
        .select('*')
        .eq('empresa_id', empresaAtualId!)
        .order('competencia', { ascending: false });
      
      if (competencia) q = q.eq('competencia', competencia);
      
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const fecharFolha = useMutation({
    mutationFn: async (id: string) => {
      const { folhaPagamentoService } = await import('@/services/folhaPagamentoService');
      return await folhaPagamentoService.fecharFolha(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      toast.success('Folha encerrada com sucesso!');
    },
    onError: (err: Error) => {
      toast.error(`Erro ao fechar folha: ${err.message}`);
    }
  });

  return {
    folhas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    fecharFolha: fecharFolha.mutate,
    isClosing: fecharFolha.isPending,
  };
}
