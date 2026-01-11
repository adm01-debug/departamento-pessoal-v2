// V15-210: src/services/feriasService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Ferias, SolicitacaoFerias, FeriasFormData } from '@/types';

export const feriasService = {
  async listByColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('ferias').select('*').eq('colaborador_id', colaboradorId).order('periodo_aquisitivo_inicio', { ascending: false });
    if (error) throw error;
    return data as Ferias[];
  },

  async listSolicitacoes(status?: string) {
    let query = supabase.from('solicitacoes_ferias').select('*, colaborador:colaboradores(nome)').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async solicitar(data: FeriasFormData) {
    const { data: solicitacao, error } = await supabase.from('solicitacoes_ferias').insert(data).select().single();
    if (error) throw error;
    return solicitacao as SolicitacaoFerias;
  },

  async aprovar(id: string, aprovadorId: string) {
    const { data, error } = await supabase.from('solicitacoes_ferias').update({ status: 'aprovada', aprovador_id: aprovadorId, data_aprovacao: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as SolicitacaoFerias;
  },

  async recusar(id: string, motivo: string) {
    const { data, error } = await supabase.from('solicitacoes_ferias').update({ status: 'recusada', motivo_recusa: motivo }).eq('id', id).select().single();
    if (error) throw error;
    return data as SolicitacaoFerias;
  }
};
