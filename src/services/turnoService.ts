import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const turnoService = {
  async listarTurnos(empresaId?: string) {
    let q = supabase.from('turnos').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarTurno(d: any) {
    const { data, error } = await supabase.from('turnos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'turno');
  },
  async atualizarTurno(id: string, d: any) {
    const { data, error } = await supabase.from('turnos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'turno');
  },
  async excluirTurno(id: string) {
    const { error } = await supabase.from('turnos').delete().eq('id', id);
    if (error) throw error;
  },
  async listarEscalas(empresaId?: string, data?: string) {
    let q = supabase.from('escalas_trabalho').select('*, colaborador:colaboradores(nome_completo), turno:turnos(nome, horario_inicio, horario_fim, cor)').order('data');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    if (data) q = q.eq('data', data);
    const { data: result, error } = await q;
    if (error) throw error;
    return result || [];
  },
  async criarEscala(d: any) {
    const { data, error } = await supabase.from('escalas_trabalho').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'escala');
  },
  async excluirEscala(id: string) {
    const { error } = await supabase.from('escalas_trabalho').delete().eq('id', id);
    if (error) throw error;
  },
};
