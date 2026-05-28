import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const bancoHorasConfigService = {
  async buscar(empresaId: string) {
    const { data, error } = await (supabase as Record<string, unknown>).from('banco_horas_config').select('*').eq('empresa_id', empresaId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async salvar(d: any) {
    const existing = d.empresa_id ? await bancoHorasConfigService.buscar(d.empresa_id) : null;
    if (existing) {
      const { data, error } = await (supabase as Record<string, unknown>).from('banco_horas_config').update(d).eq('id', existing.id).select().maybeSingle();
      if (error) throw error;
      return ensure(data, 'configuração banco de horas');
    }
    const { data, error } = await (supabase as Record<string, unknown>).from('banco_horas_config').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'configuração banco de horas');
  },
};
