// V15-214: src/services/relatorioService.ts
import { supabase } from '@/integrations/supabase/client';

export const relatorioService = {
  async gerarFolhaPagamento(empresaId: string, competencia: string) {
    const { data, error } = await supabase.rpc('relatorio_folha_pagamento', {
      p_empresa_id: empresaId,
      p_competencia: competencia,
    });
    if (error) throw error;
    return data;
  },

  async gerarResumoColaboradores(empresaId: string) {
    const { data, error } = await supabase.rpc('relatorio_resumo_colaboradores', {
      p_empresa_id: empresaId,
    });
    if (error) throw error;
    return data;
  },

  async gerarAniversariantes(empresaId: string, mes: number) {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('id, nome_completo, data_nascimento')
      .eq('empresa_id', empresaId)
      .eq('status', 'ativo');
    if (error) throw error;
    return data?.filter(
      (c) => c.data_nascimento && new Date(c.data_nascimento).getMonth() + 1 === mes
    );
  },

  async gerarVencimentoFerias(empresaId: string) {
    const { data, error } = await supabase.rpc('relatorio_vencimento_ferias', {
      p_empresa_id: empresaId,
    });
    if (error) throw error;
    return data;
  },

  async gerarTurnover(empresaId: string, ano: number) {
    const { data, error } = await supabase.rpc('relatorio_turnover', {
      p_empresa_id: empresaId,
      p_ano: ano,
    });
    if (error) throw error;
    return data;
  },

  async exportarCSV(dados: any[], colunas: string[]): Promise<Blob> {
    const header = colunas.join(';');
    const rows = dados.map((d) => colunas.map((c) => d[c] ?? '').join(';'));
    const csv = [header, ...rows].join('\n');
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  },
};
