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
      const { data, error } = await supabase
        .from('folhas_pagamento')
        .update({ status: 'fechada', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      toast.success('Folha encerrada com sucesso!');
    },
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
