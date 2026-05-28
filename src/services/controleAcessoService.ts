import { supabase } from '@/integrations/supabase/client';
export const controleAcessoService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('controle_acesso').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async registrar(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('controle_acesso').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de acesso foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('controle_acesso').delete().eq('id', id);
    if (error) throw error;
  
  },
};

