// V15-209: src/services/folhaService.ts
import { supabase } from '@/integrations/supabase/client';
import type { FolhaPagamento, ItemFolha, FolhaFilters } from '@/types';

export const folhaService = {
  async list(filters?: FolhaFilters) {
    let query = supabase.from('folha_pagamento').select('*').order('competencia', { ascending: false });
    if (filters?.competencia) query = query.eq('competencia', filters.competencia);
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return data as FolhaPagamento[];
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('folha_pagamento').select('*').eq('id', id).single();
    if (error) throw error;
    return data as FolhaPagamento;
  },

  async getItens(folhaId: string) {
    const { data, error } = await supabase.from('itens_folha').select('*').eq('folha_id', folhaId);
    if (error) throw error;
    return data as ItemFolha[];
  },

  async calcular(empresaId: string, competencia: string) {
    const { data, error } = await supabase.rpc('calcular_folha', { p_empresa_id: empresaId, p_competencia: competencia });
    if (error) throw error;
    return data;
  },

  async fechar(id: string) {
    const { data, error } = await supabase.from('folha_pagamento').update({ status: 'fechada', data_fechamento: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as FolhaPagamento;
  }
};
