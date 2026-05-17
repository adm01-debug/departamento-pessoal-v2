import { supabase } from '@/integrations/supabase/client';

export const bancoHorasService = {
  async listarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('banco_horas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getSaldo(colaboradorId: string): Promise<number> {
    const { data, error } = await supabase.from('banco_horas').select('tipo, quantidade_horas').eq('colaborador_id', colaboradorId);
    if (error) throw error;
    if (!data) return 0;
    return data.reduce((saldo, item) => {
      const horas = parseFloat(item.quantidade_horas) || 0;
      return item.tipo === 'credito' ? saldo + horas : saldo - horas;
    }, 0);
  },
  async registrar(d: any) {
    const { data, error } = await supabase.from('banco_horas').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
};
