import { supabase } from '@/integrations/supabase/client';
export const webhookService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let query = supabase.from('webhooks').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await supabase.from('webhooks').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de webhook foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await supabase.from('webhooks').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de webhook foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('webhooks').delete().eq('id', id);
    if (error) throw error;
  
  },
  
  async listarLogs(webhookId: string): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  
  },
};

