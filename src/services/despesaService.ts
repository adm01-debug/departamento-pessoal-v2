import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const despesaService = {
  async listar(empresaId?: string) {
    let q = supabase.from('despesas').select('*, colaborador:colaboradores(nome_completo)').order('data_despesa', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('despesas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'despesa');
  },
  async aprovar(id: string, aprovadoPor?: string | null, obs?: string) {
    const { data: authData } = await supabase.auth.getUser();
    const aprovadorId = aprovadoPor || authData.user?.id || null;
    const { data, error } = await supabase
      .from('despesas')
      .update({ status: 'aprovada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return ensure(data, 'despesa');
  },
  async rejeitar(id: string, aprovadoPor?: string | null, obs?: string) {
    const { data: authData } = await supabase.auth.getUser();
    const aprovadorId = aprovadoPor || authData.user?.id || null;
    const { data, error } = await supabase
      .from('despesas')
      .update({ status: 'rejeitada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return ensure(data, 'despesa');
  },
  async reembolsar(id: string) {
    const { data, error } = await supabase.from('despesas').update({ status: 'reembolsada' }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'despesa');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('despesas').delete().eq('id', id);
    if (error) throw error;
  },
};
