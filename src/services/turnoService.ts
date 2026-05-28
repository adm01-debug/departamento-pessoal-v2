import { supabase } from '@/integrations/supabase/client';
export const turnoService = {
  async listarTurnos(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('turnos').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criarTurno(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('turnos').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de turno foi retornado.');
    return data;
  
  },
  
  async atualizarTurno(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('turnos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de turno foi retornado.');
    return data;
  
  },
  
  async excluirTurno(id: string): Promise<void> {
    
    const { error } = await supabase.from('turnos').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async listarEscalas(empresaId?: string, data?: string): Promise<any[]> {
    
    let q = supabase.from('escalas_trabalho').select('*, colaborador:colaboradores(nome_completo), turno:turnos(nome, horario_inicio, horario_fim, cor)').order('data');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    if (data) q = q.eq('data', data);
    const { data: result, error } = await q;
    if (error) throw error;
    return result || [];
  
  },
  
  async criarEscala(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('escalas_trabalho').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de escala foi retornado.');
    return data;
  
  },
  
  async excluirEscala(id: string): Promise<void> {
    
    const { error } = await supabase.from('escalas_trabalho').delete().eq('id', id);
    if (error) throw error;
  
  },
};

