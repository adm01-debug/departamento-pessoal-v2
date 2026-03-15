import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(data: T | null, e: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${e} retornado.`);
  return data;
};

export const horaExtraService = {
  async listar(empresaId?: string) {
    let query = supabase
      .from('solicitacoes_hora_extra')
      .select('*, colaborador:colaboradores(nome_completo)')
      .order('created_at', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('solicitacoes_hora_extra').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'solicitação de hora extra');
  },
  async aprovar(id: string, aprovadoPor: string, obs?: string) {
    const { data, error } = await supabase
      .from('solicitacoes_hora_extra')
      .update({ status: 'aprovada', aprovado_por: aprovadoPor, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
      .eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'solicitação');
  },
  async rejeitar(id: string, aprovadoPor: string, obs?: string) {
    const { data, error } = await supabase
      .from('solicitacoes_hora_extra')
      .update({ status: 'rejeitada', aprovado_por: aprovadoPor, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
      .eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'solicitação');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('solicitacoes_hora_extra').delete().eq('id', id);
    if (error) throw error;
  },
};
