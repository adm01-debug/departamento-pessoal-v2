import { supabase } from '@/integrations/supabase/client';
export const episService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = (supabase as any).from('epis').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await (supabase as any).from('epis').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de EPI foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await (supabase as any).from('epis').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de EPI foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await (supabase as any).from('epis').delete().eq('id', id);
    if (error) throw error;
  
  },
};

export const episEntregasService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = (supabase as any).from('epis_entregas').select('*, epi:epis(nome, ca), colaborador:colaboradores(nome_completo)').order('data_entrega', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async buscarPorColaborador(colaboradorId: string): Promise<any[]> {
    
    const { data, error } = await (supabase as any).from('epis_entregas').select('*, epi:epis(nome, ca)').eq('colaborador_id', colaboradorId).order('data_entrega', { ascending: false });
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await (supabase as any).from('epis_entregas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de entrega de EPI foi retornado.');
    return data;
  
  },
  
  async registrarDevolucao(id: string, dataDevolucao: string): Promise<any> {
    
    const { data, error } = await (supabase as any).from('epis_entregas').update({ data_devolucao: dataDevolucao }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de devolução de EPI foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await (supabase as any).from('epis_entregas').delete().eq('id', id);
    if (error) throw error;
  
  },
};

