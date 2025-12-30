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
        .maybeSingle();
      if (error) throw error;
      
      if (!data) return { colaborador_id: colaboradorId, saldo_minutos: 0, saldo_formatado: '00:00', ultima_atualizacao: '' };
      
      const horas = Math.floor(Math.abs(data.saldo_minutos) / 60);
      const mins = Math.abs(data.saldo_minutos) % 60;
      const sinal = data.saldo_minutos < 0 ? '-' : '';
      
      return {
        ...data,
        saldo_formatado: `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
      } as BancoHoras;
    },
    enabled: !!colaboradorId,
  });

  return { banco, isLoading, saldo: banco?.saldo_minutos ?? 0 };
}

export default usePontoBanco;
