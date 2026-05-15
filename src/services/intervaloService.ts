import { supabase } from '@/integrations/supabase/client';
export const intervaloService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let query = supabase.from('configuracoes_intervalo').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await supabase.from('configuracoes_intervalo').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de configuração de intervalo foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await supabase.from('configuracoes_intervalo').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de configuração de intervalo foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('configuracoes_intervalo').delete().eq('id', id);
    if (error) throw error;
  
  },
};

