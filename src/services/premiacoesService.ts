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

  async atualizarStatusPagamento(id: string, status: string, valorAprovado?: number, comentario?: string) {
    const { data: original, error: fetchErr } = await supabase.from('premiacoes_pagamentos').select('*').eq('id', id).single();
    if (fetchErr) throw fetchErr;

    const { data, error } = await supabase
      .from('premiacoes_pagamentos')
      .update({ 
        status, 
        valor_aprovado: valorAprovado,
        historico_mudancas: [...(original.historico_mudancas || []), { status, data: new Date().toISOString(), comentario, user: 'current_user' }]
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    return data;
  },

  async reconciliarFolha(id: string, valorFolha: number, justificativa?: string) {
    const { data: original, error: fetchErr } = await supabase.from('premiacoes_pagamentos').select('*').eq('id', id).single();
    if (fetchErr) throw fetchErr;

    const valorAprovado = Number(original.valor_aprovado || original.valor_calculado);
    const status_conciliacao = valorFolha === valorAprovado ? 'conciliado' : 'divergente';

    const { data, error } = await supabase
      .from('premiacoes_pagamentos')
      .update({
        valor_folha_real: valorFolha,
        status_conciliacao,
        justificativa_divergencia: justificativa,
        status: status_conciliacao === 'conciliado' ? 'pago' : 'divergente_em_revisao',
        historico_mudancas: [...(original.historico_mudancas || []), { 
          status: status_conciliacao === 'conciliado' ? 'pago' : 'divergente_em_revisao', 
          data: new Date().toISOString(), 
          comentario: `Conciliação: ${status_conciliacao}. ${justificativa || ''}`,
          valor_folha: valorFolha,
          user: 'current_user' 
        }]
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Log to audit table
    await supabase.from('premiacoes_auditoria').insert({
      entidade_tipo: 'pagamento',
      entidade_id: id,
      acao: 'conciliacao_folha',
      detalhes: { valor_aprovado: valorAprovado, valor_folha: valorFolha, status_conciliacao, justificativa }
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
