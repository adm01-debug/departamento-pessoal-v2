import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const workflowService = {
  async listarDefinicoes(empresaId?: string) {
    let q = supabase.from('workflows_definicoes').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarDefinicao(d: any) {
    const { data, error } = await supabase.from('workflows_definicoes').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'workflow');
  },
  async atualizarDefinicao(id: string, d: any) {
    const { data, error } = await supabase.from('workflows_definicoes').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'workflow');
  },
  async excluirDefinicao(id: string) {
    const { error } = await supabase.from('workflows_definicoes').delete().eq('id', id);
    if (error) throw error;
  },
  async listarEtapas(workflowId: string) {
    const { data, error } = await supabase.from('workflows_etapas').select('*').eq('workflow_id', workflowId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  async criarEtapa(d: any) {
    const { data, error } = await supabase.from('workflows_etapas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'etapa');
  },
  async excluirEtapa(id: string) {
    const { error } = await supabase.from('workflows_etapas').delete().eq('id', id);
    if (error) throw error;
  },
  async listarExecucoes(empresaId?: string) {
    let q = supabase.from('workflows_execucoes').select('*, workflow:workflows_definicoes(nome, tipo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarExecucao(d: any) {
    const { data, error } = await supabase.from('workflows_execucoes').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'execução');
  },
  async atualizarExecucao(id: string, d: any) {
    const { data, error } = await supabase.from('workflows_execucoes').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'execução');
  },
  async registrarHistorico(d: any) {
    const { data, error } = await supabase.from('workflows_historico').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'histórico');
  },
};
