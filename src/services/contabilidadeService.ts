import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const contabilidadeService = {
  async listLancamentos(empresaId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await supabase
        .from('lancamentos_contabeis')
        .select('*, conta_debito:plano_contas!lancamentos_contabeis_conta_debito_id_fkey(*), conta_credito:plano_contas!lancamentos_contabeis_conta_credito_id_fkey(*)')
        .eq('empresa_id', empresaId)
        .order('data_lancamento', { ascending: false });
      
      if (error) throw error;
      return data || [];
    })());
  },

  async listPlanoContas(empresaId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await supabase
        .from('plano_contas')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('codigo');
      
      if (error) throw error;
      return data || [];
    })());
  },

  async gerarLancamentosFolha(empresaId: string, folhaId: string): Promise<Result<void>> {
    try {
      // Fetch folha summary
      const { data: folha, error: fError } = await supabase
        .from('folhas_pagamento')
        .select('*')
        .eq('id', folhaId)
        .single();
      
      if (fError) throw fError;

      // Fetch plano de contas
      const { data: plano, error: pError } = await supabase
        .from('plano_contas')
        .select('*')
        .eq('empresa_id', empresaId);
      
      if (pError) throw pError;

      const contaSalariosPagar = plano?.find(c => c.codigo === '2.1.01.001');
      const contaDespesaSalarios = plano?.find(c => c.codigo === '3.1.01.001');

      if (!contaSalariosPagar || !contaDespesaSalarios) {
        return Err({
          type: 'VALIDATION_ERROR',
          severity: 'error',
          message: 'Plano de contas incompleto. Certifique-se de que as contas padrões existem.',
          timestamp: new Date()
        });
      }

      const lancamentos = [
        {
          empresa_id: empresaId,
          folha_id: folhaId,
          data_lancamento: new Date().toISOString().split('T')[0],
          descricao: `Provisão de Folha de Pagamento - Competência ${folha.competencia}`,
          valor: folha.total_liquido,
          conta_debito_id: contaDespesaSalarios.id,
          conta_credito_id: contaSalariosPagar.id,
          origem: 'folha',
          status: 'pendente'
        }
      ];

      const { error: lError } = await supabase
        .from('lancamentos_contabeis')
        .insert(lancamentos as any);
      
      if (lError) throw lError;
      return Ok(undefined);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Falha ao gerar lançamentos contábeis',
        timestamp: new Date()
      });
    }
  },

  async exportarSPED(empresaId: string): Promise<Result<string>> {
    try {
      const result = await this.listLancamentos(empresaId);
      if (!result.ok) return result;
      const lancamentos = result.value;
      
      let sped = '|0000|LECD|...|SPED CONTABIL|\r\n';
      lancamentos.forEach((l: any) => {
        sped += `|I200|${l.id}|${l.data_lancamento}|${l.valor}|N|\r\n`;
        sped += `|I250|${l.conta_debito?.codigo}|...|D|${l.valor}|...|\r\n`;
        sped += `|I250|${l.conta_credito?.codigo}|...|C|${l.valor}|...|\r\n`;
      });
      sped += '|9999|...|END|\r\n';

      return Ok(sped);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao exportar SPED',
        timestamp: new Date()
      });
    }
  }
};

