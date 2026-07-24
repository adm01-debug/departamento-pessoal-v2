import { supabase } from '@/integrations/supabase/client';

// Parse PostgreSQL INTERVAL string (e.g. "08:00:00", "01:30:00") to decimal hours
function parseIntervalToHours(interval: string | null | undefined): number {
  if (!interval) return 0;
  const parts = String(interval).split(':');
  if (parts.length < 2) return parseFloat(interval) || 0;
  const [h, m, s] = parts.map(Number);
  return h + (m || 0) / 60 + (s || 0) / 3600;
}

export const bancoHorasService = {
  async listarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('banco_horas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getSaldo(colaboradorId: string): Promise<number> {
    const { data, error } = await supabase.from('banco_horas').select('tipo, horas').eq('colaborador_id', colaboradorId);
    if (error) throw error;
    if (!data) return 0;
    return data.reduce((saldo, item) => {
      const horas = parseIntervalToHours((item as any).horas);
      return (item as any).tipo === 'credito' ? saldo + horas : saldo - horas;
    }, 0);
  },
  async registrar(d: any) {
    const { data, error } = await supabase.from('banco_horas').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
};
