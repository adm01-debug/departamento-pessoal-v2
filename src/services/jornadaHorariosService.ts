import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const jornadaHorariosService = {
  async listar(jornadaId: string) {
    const { data, error } = await (supabase as any).from('jornadas_horarios').select('*').eq('jornada_id', jornadaId).order('dia_semana');
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await (supabase as any).from('jornadas_horarios').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'horário de jornada');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await (supabase as any).from('jornadas_horarios').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'horário de jornada');
  },
  async excluir(id: string) {
    const { error } = await (supabase as any).from('jornadas_horarios').delete().eq('id', id);
    if (error) throw error;
  },
  async salvarGrade(jornadaId: string, horarios: any[]) {
    await (supabase as any).from('jornadas_horarios').delete().eq('jornada_id', jornadaId);
    if (horarios.length === 0) return [];
    const { data, error } = await (supabase as any).from('jornadas_horarios').insert(horarios.map((h: any) => ({ ...h, jornada_id: jornadaId }))).select();
    if (error) throw error;
    return data || [];
  },
};
