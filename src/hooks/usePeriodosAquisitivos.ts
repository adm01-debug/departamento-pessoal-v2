import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePeriodosAquisitivos(colaboradorId?: string) {
  const query = useQuery({
    queryKey: ['periodos-aquisitivos', colaboradorId],
    enabled: !!colaboradorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periodos_aquisitivos')
        .select('*')
        .eq('colaborador_id', colaboradorId!)
        .order('data_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return {
    periodos: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch
  };
}
