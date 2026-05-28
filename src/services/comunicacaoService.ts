import { supabase } from '@/integrations/supabase/client';
export const comunicacaoService = {
  async listarComunicados(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('comunicados').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criarComunicado(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('comunicados').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de comunicado foi retornado.');
    return data;
  
  },
  
  async atualizarComunicado(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('comunicados').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de comunicado foi retornado.');
    return data;
  
  },
  
  async excluirComunicado(id: string): Promise<void> {
    
    const { error } = await supabase.from('comunicados').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async marcarLido(comunicadoId: string, usuarioId: string): Promise<unknown> {
    
    const { data, error } = await supabase.from('comunicados_leituras').insert({ comunicado_id: comunicadoId, usuario_id: usuarioId }).select().maybeSingle();
    if (error) throw error;
    return data;
  
  },
  
  async listarDenuncias(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('canal_etica').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criarDenuncia(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('canal_etica').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de denúncia foi retornado.');
    return data;
  
  },
  
  async atualizarDenuncia(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('canal_etica').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de denúncia foi retornado.');
    return data;
  
  },
};

