import { supabase } from '@/integrations/supabase/client';
export const faltasService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = (supabase as any).from('faltas').select('*, colaborador:colaboradores(nome_completo)').order('data', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async buscarPorColaborador(colaboradorId: string): Promise<any[]> {
    
    const { data, error } = await (supabase as any).from('faltas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await (supabase as any).from('faltas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de falta foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await (supabase as any).from('faltas').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de falta foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await (supabase as any).from('faltas').delete().eq('id', id);
    if (error) throw error;
  
  },
};

