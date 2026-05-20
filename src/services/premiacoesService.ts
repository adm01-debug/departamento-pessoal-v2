import { supabase } from '@/integrations/supabase/client';

export const premiacoesService = {
  async listarCampanhas(empresaId?: string) {
    let q = supabase.from('premiacoes_campanhas').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async listarRegras(campanhaId: string) {
    const { data, error } = await supabase
      .from('premiacoes_regras')
      .select('*, meta:metas_okrs(*)')
      .eq('campanha_id', campanhaId);
    if (error) throw error;
    return data || [];
  },

  async listarPagamentos(campanhaId?: string, empresaId?: string) {
    let q = supabase.from('premiacoes_pagamentos').select(`
      *,
      colaborador:colaboradores(nome_completo, salario_base),
      campanha:premiacoes_campanhas(nome)
    `);
    
    if (campanhaId) q = q.eq('campanha_id', campanhaId);
    if (empresaId) q = q.filter('campanha.empresa_id', 'eq', empresaId);
    
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async criarCampanha(d: any) {
    const { data, error } = await supabase.from('premiacoes_campanhas').insert(d).select().single();
    if (error) throw error;
    return data;
  },

  async criarRegra(d: any) {
    const { data, error } = await supabase.from('premiacoes_regras').insert(d).select().single();
    if (error) throw error;
    return data;
  },

  async atualizarStatusPagamento(id: string, status: string, valorAprovado?: number) {
    const { data, error } = await supabase
      .from('premiacoes_pagamentos')
      .update({ status, valor_aprovado: valorAprovado })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
