import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';

export interface ReconciliacaoLog {
  id: string;
  executado_em: string;
  verificadas: number;
  corrigidas: number;
  restantes: number;
  duracao_ms: number;
  empresa_id: string | null;
}

export function useReconciliacaoLogs(limit = 10) {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  return useQuery({
    queryKey: ['ferias', 'reconciliacao-logs', empresaId, limit],
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async (): Promise<ReconciliacaoLog[]> => {
      const { data, error } = await supabase
        .from('ferias_reconciliacao_logs')
        .select('id, executado_em, verificadas, corrigidas, restantes, duracao_ms, empresa_id')
        .eq('empresa_id', empresaId!)
        .order('executado_em', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as ReconciliacaoLog[];
    },
  });
}
