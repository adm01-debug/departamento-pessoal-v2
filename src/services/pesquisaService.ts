import { supabase } from '@/integrations/supabase/client';
export const pesquisaService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('pesquisas').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('pesquisas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de pesquisa foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('pesquisas').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de pesquisa foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('pesquisas').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async listarPerguntas(pesquisaId: string): Promise<any[]> {
    
    const { data, error } = await supabase.from('pesquisas_perguntas').select('*').eq('pesquisa_id', pesquisaId).order('ordem');
    if (error) throw error;
    return data || [];
  
  },
  
  async criarPergunta(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('pesquisas_perguntas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de pergunta foi retornado.');
    return data;
  
  },
  
  async excluirPergunta(id: string): Promise<void> {
    
    const { error } = await supabase.from('pesquisas_perguntas').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async enviarResposta(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('pesquisas_respostas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de resposta foi retornado.');
    return data;
  
  },
  
  async listarRespostas(pesquisaId: string): Promise<any[]> {
    
    const { data, error } = await supabase.from('pesquisas_respostas').select('*').eq('pesquisa_id', pesquisaId);
    if (error) throw error;
    return data || [];
  
  },
};

