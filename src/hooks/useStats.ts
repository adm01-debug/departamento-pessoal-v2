/**
 * @fileoverview Hook para estatísticas
 * @module hooks/useStats
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Stats {
  colaboradores: { total: number; ativos: number; inativos: number };
  admissoes: { mes: number; ano: number };
  desligamentos: { mes: number; ano: number };
  turnover: number;
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stats> => {
      const [colabs, admissoes, desligamentos] = await Promise.all([
        supabase.from('colaboradores').select('status', { count: 'exact' }),
        supabase.from('admissoes').select('id', { count: 'exact' }),
        supabase.from('desligamentos').select('id', { count: 'exact' }),
      ]);
      
      const total = colabs.count || 0;
      const ativos = total; // Simplificado
      
      return {
        colaboradores: { total, ativos, inativos: 0 },
        admissoes: { mes: admissoes.count || 0, ano: 0 },
        desligamentos: { mes: desligamentos.count || 0, ano: 0 },
        turnover: total > 0 ? ((desligamentos.count || 0) / total) * 100 : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useStats;
