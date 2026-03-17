import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';

export function useFolha(competencia?: string) {
  const { empresaAtualId } = useEmpresas();

  const query = useQuery({
    queryKey: ['folha', empresaAtualId, competencia],
    enabled: !!empresaAtualId,
    queryFn: async () => {
      let q = supabase
        .from('folhas_pagamento')
        .select('*')
        .eq('empresa_id', empresaAtualId!)
        .order('competencia', { ascending: false })
        .range(0, 499);
      if (competencia) q = q.eq('competencia', competencia);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  return {
    folhas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
