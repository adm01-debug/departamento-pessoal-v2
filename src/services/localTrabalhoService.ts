import { supabase } from '@/integrations/supabase/client';
export const localTrabalhoService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let query = supabase.from('locais_trabalho').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await supabase.from('locais_trabalho').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de local de trabalho foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await supabase.from('locais_trabalho').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de local de trabalho foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('locais_trabalho').delete().eq('id', id);
    if (error) throw error;
  
  },
};

