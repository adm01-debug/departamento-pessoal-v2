import { supabase } from '@/integrations/supabase/client';
export const despesaService = {
  async listar(empresaId: string, opts: { from?: number; to?: number } = {}): Promise<any[]> {
    if (!empresaId) throw new Error('empresaId é obrigatório para listar despesas (multi-tenant).');
    const from = opts.from ?? 0;
    const to = opts.to ?? 499;
    const { data, error } = await supabase
      .from('despesas')
      .select('*, colaborador:colaboradores(nome_completo)')
      .eq('empresa_id', empresaId)
      .order('data_despesa', { ascending: false })
      .range(from, to);
    if (error) throw error;
    return data || [];
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await supabase.from('despesas').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
    return data;
  
  },
  
  async aprovar(id: string, aprovadoPor?: string | null, obs?: string): Promise<any> {
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
      throw new Error('Falha ao aprovar despesa', { cause: e });
    }
  },
  
  async rejeitar(id: string, aprovadoPor?: string | null, obs?: string): Promise<any> {
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
      throw new Error('Falha ao rejeitar despesa', { cause: e });
    }
  },
  
  async reembolsar(id: string): Promise<any> {
    
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

