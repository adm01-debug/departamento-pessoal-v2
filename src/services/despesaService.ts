import { supabase } from '@/integrations/supabase/client';
export const despesaService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('despesas').select('*, colaborador:colaboradores(nome_completo)').order('data_despesa', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<unknown> {
    
    const { data, error } = await supabase.from('despesas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
    return data;
  
  },
  
  async aprovar(id: string, aprovadoPor?: string | null, obs?: string): Promise<unknown> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const aprovadorId = aprovadoPor || authData.user?.id || null;
      const { data, error } = await supabase
        .from('despesas')
        .update({ status: 'aprovada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return (data);
    } catch (e: any) {
      throw new Error('Falha ao aprovar despesa');
    }
  },
  
  async rejeitar(id: string, aprovadoPor?: string | null, obs?: string): Promise<unknown> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const aprovadorId = aprovadoPor || authData.user?.id || null;
      const { data, error } = await supabase
        .from('despesas')
        .update({ status: 'rejeitada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return (data);
    } catch (e: any) {
      throw new Error('Falha ao rejeitar despesa');
    }
  },
  
  async reembolsar(id: string): Promise<unknown> {
    
    const { data, error } = await supabase.from('despesas').update({ status: 'reembolsada' }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('despesas').delete().eq('id', id);
    if (error) throw error;
  
  },
};

