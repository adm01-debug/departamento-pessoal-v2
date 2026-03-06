// @ts-nocheck
/**
 * @fileoverview Hook para banco de horas
 * @module hooks/usePontoBanco
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BancoHoras {
  colaborador_id: string;
  saldo_minutos: number;
  saldo_formatado: string;
  ultima_atualizacao: string;
}

export function usePontoBanco(colaboradorId?: string) {
  const { data: banco, isLoading } = useQuery({
    queryKey: ['bancoHoras', colaboradorId],
    queryFn: async () => {
      if (!colaboradorId) return null;
      const { data, error } = await supabase
        .from('banco_horas')
        .select('*')
        .eq('colaborador_id', colaboradorId)
        .order('data', { ascending: false });
      if (error) throw error;
      
      if (!data || data.length === 0) return { colaborador_id: colaboradorId, saldo_minutos: 0, saldo_formatado: '00:00', ultima_atualizacao: '' };
      
      // Calculate total from individual entries
      const totalMinutos = data.reduce((acc, entry) => {
        const [h, m] = (entry.horas || '00:00').split(':').map(Number);
        const mins = (h * 60) + (m || 0);
        return acc + (entry.tipo === 'credito' ? mins : -mins);
      }, 0);
      
      const horas = Math.floor(Math.abs(totalMinutos) / 60);
      const mins = Math.abs(totalMinutos) % 60;
      const sinal = totalMinutos < 0 ? '-' : '';
      
      return {
        colaborador_id: colaboradorId,
        saldo_minutos: totalMinutos,
        saldo_formatado: `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
        ultima_atualizacao: data[0]?.created_at || '',
      } as BancoHoras;
    },
    enabled: !!colaboradorId,
  });

  return { banco, isLoading, saldo: banco?.saldo_minutos ?? 0 };
}

export default usePontoBanco;
