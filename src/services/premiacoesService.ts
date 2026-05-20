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

  async atualizarStatusPagamento(id: string, status: string, valorAprovado?: number, motivo?: string) {
    const { data: original, error: fetchErr } = await supabase.from('premiacoes_pagamentos').select('*').eq('id', id).single();
    if (fetchErr) throw fetchErr;

    const { data, error } = await supabase
      .from('premiacoes_pagamentos')
      .update({ 
        status, 
        valor_aprovado: valorAprovado,
        integrado_folha: status === 'pago' ? true : false,
        data_integracao: status === 'pago' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Auditoria
    await supabase.from('premiacoes_auditoria').insert({
      entidade_tipo: 'pagamento',
      entidade_id: id,
      acao: status === 'aprovado' ? 'aprovacao' : 'alteracao',
      dados_anteriores: original,
      dados_novos: data,
      motivo: motivo || `Status alterado para ${status}`
    });

    return data;
  },

  async listarAuditoria(entidadeId?: string) {
    let q = supabase.from('premiacoes_auditoria').select('*').order('created_at', { ascending: false });
    if (entidadeId) q = q.eq('entidade_id', entidadeId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async exportarRelatorio(filtros: any) {
    // Simulação de exportação - na prática buscaria dados e formataria
    const pagamentos = await this.listarPagamentos(undefined, filtros.empresaId);
    return pagamentos;
  }
};
