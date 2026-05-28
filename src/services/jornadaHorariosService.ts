import { supabase } from '@/integrations/supabase/client';
export const jornadaHorariosService = {
  async listar(jornadaId: string): Promise<any[]> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('jornadas_horarios').select('*').eq('jornada_id', jornadaId).order('dia_semana');
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<unknown> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('jornadas_horarios').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de horário de jornada foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('jornadas_horarios').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de horário de jornada foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await (supabase as Record<string, unknown>).from('jornadas_horarios').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async salvarGrade(jornadaId: string, horarios: any[]): Promise<any[]> {
    try {
      await (supabase as Record<string, unknown>).from('jornadas_horarios').delete().eq('jornada_id', jornadaId);
      if (horarios.length === 0) return ([]);
      const { data, error } = await (supabase as Record<string, unknown>).from('jornadas_horarios').insert(horarios.map((h: any) => ({ ...h, jornada_id: jornadaId }))).select();
      if (error) throw error;
      return (data || []);
    } catch (e: any) {
      throw new Error('Falha ao salvar grade de horários');
    }
  },
};

