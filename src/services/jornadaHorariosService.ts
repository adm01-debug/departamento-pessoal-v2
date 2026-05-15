import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const jornadaHorariosService = {
  async listar(jornadaId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('jornadas_horarios').select('*').eq('jornada_id', jornadaId).order('dia_semana');
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('jornadas_horarios').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de horário de jornada foi retornado.');
      return data;
    })());
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('jornadas_horarios').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de horário de jornada foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await (supabase as any).from('jornadas_horarios').delete().eq('id', id);
      if (error) throw error;
    })());
  },
  
  async salvarGrade(jornadaId: string, horarios: any[]): Promise<Result<any[]>> {
    try {
      await (supabase as any).from('jornadas_horarios').delete().eq('jornada_id', jornadaId);
      if (horarios.length === 0) return Ok([]);
      const { data, error } = await (supabase as any).from('jornadas_horarios').insert(horarios.map((h: any) => ({ ...h, jornada_id: jornadaId }))).select();
      if (error) throw error;
      return Ok(data || []);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao salvar grade de horários',
        timestamp: new Date()
      });
    }
  },
};

