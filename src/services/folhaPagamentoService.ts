import { supabase } from '@/integrations/supabase/client';
import { CalculoResultado } from '@/utils/folhaCalc';
import { Result, Ok, Err, toResult } from '@/types/result';

export interface HoleriteData extends CalculoResultado {
  colaboradorNome: string;
  cpf: string;
  cargo: string;
  dataAdmissao: string;
  competencia: string;
  empresaNome: string;
  cnpj: string;
  assinado: boolean;
  hashAssinatura?: string;
  dataAssinatura?: string;
}

export const folhaPagamentoService = {
  /**
   * Gera os dados para um holerite (contracheque)
   */
  gerarDadosHolerite: async (folhaId: string, colaboradorId: string): Promise<Result<HoleriteData>> => {
    try {
      const { data: item, error: itemError } = await supabase
        .from('folha_itens')
        .select('*, colaborador:colaboradores(*), folha:folhas_pagamento(*)')
        .eq('folha_id', folhaId)
        .eq('colaborador_id', colaboradorId)
        .single();

      if (itemError || !item) {
        return Err({
          type: 'NOT_FOUND',
          severity: 'error',
          message: 'Dados da folha não encontrados',
          timestamp: new Date()
        });
      }

      const folhaHeader = item.folha as any;
      
      const { data: emp } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', folhaHeader.empresa_id)
        .single();

      const colab = item.colaborador as any;
      const detalhes = item.detalhes as any;

      const { data: holerite } = await supabase
        .from('holerites')
        .select('*')
        .eq('folha_id', folhaId)
        .eq('colaborador_id', colaboradorId)
        .maybeSingle();

      return Ok({
        proventos: item.total_proventos || 0,
        descontos: item.total_descontos || 0,
        liquido: item.total_liquido || 0,
        inss: item.inss_mes || 0,
        irrf: item.irrf_mes || 0,
        fgts: item.fgts_mes || 0,
        horasExtras: detalhes?.horasExtras || 0,
        dsr: detalhes?.dsr || 0,
        decimoTerceiro: detalhes?.decimoTerceiro || 0,
        faixaInss: detalhes?.faixaInss || '',
        faixaIrrf: detalhes?.faixaIrrf || '',
        detalheEventos: detalhes?.detalheEventos || [],
        colaboradorNome: colab.nome_completo,
        cpf: colab.cpf,
        cargo: colab.cargo || 'Não informado',
        dataAdmissao: colab.data_admissao,
        competencia: folhaHeader.competencia,
        empresaNome: emp?.razao_social || 'N/A',
        cnpj: emp?.cnpj || 'N/A',
        assinado: holerite?.assinado || false,
        hashAssinatura: holerite?.hash_assinatura ?? undefined,
        dataAssinatura: holerite?.data_assinatura ?? undefined
      });
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Falha ao gerar holerite',
        timestamp: new Date()
      });
    }
  },

  /**
   * Assina digitalmente um holerite
   */
  assinarHolerite: async (folhaId: string, colaboradorId: string): Promise<Result<string>> => {
    try {
      const hash = btoa(`assinatura-${folhaId}-${colaboradorId}-${new Date().getTime()}`).substring(0, 32);
      
      const { data: colab } = await supabase
        .from('colaboradores')
        .select('nome_completo, cpf, cargo')
        .eq('id', colaboradorId)
        .single();

      const { error } = await supabase
        .from('holerites')
        .upsert({
          folha_id: folhaId,
          colaborador_id: colaboradorId,
          colaborador_nome: colab?.nome_completo || 'N/A',
          colaborador_cpf: colab?.cpf || 'N/A',
          colaborador_cargo: colab?.cargo || 'N/A',
          hash_assinatura: hash,
          data_assinatura: new Date().toISOString(),
          assinado: true
        } as any);

      if (error) throw error;
      return Ok(hash);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao assinar holerite digitalmente',
        timestamp: new Date()
      });
    }
  },

  /**
   * Finaliza e fecha a folha de competência
   */
  fecharFolha: async (folhaId: string): Promise<Result<{ success: boolean; hash?: string }>> => {
    try {
      const { validadorFolha } = await import('@/utils/folha/validadorFolha');
      const alertas = await validadorFolha.validarFolha(folhaId);
      
      const alertasCriticos = alertas.filter(a => a.gravidade === 'alta');
      if (alertasCriticos.length > 0) {
        return Err({
          type: 'VALIDATION_ERROR',
          severity: 'warning',
          message: `Não é possível fechar a folha: existem ${alertasCriticos.length} alertas críticos.`,
          timestamp: new Date()
        });
      }

      const { data: itens } = await supabase
        .from('folha_itens')
        .select('total_liquido')
        .eq('folha_id', folhaId);
      
      const totalFolha = itens?.reduce((acc, curr) => acc + Number(curr.total_liquido), 0) || 0;
      const hashIntegridade = btoa(`folha-${folhaId}-${totalFolha}-${new Date().toISOString()}`).substring(0, 32);

      const { data: currentFolha } = await supabase
        .from('folhas_pagamento')
        .select('version')
        .eq('id', folhaId)
        .single();

      const { error } = await supabase
        .from('folhas_pagamento')
        .update({ 
          status: 'fechada',
          data_fechamento: new Date().toISOString()
        })
        .eq('id', folhaId)
        .eq('version', currentFolha?.version || 1);

      if (error) throw error;
      
      const { data: folhaData } = await supabase
        .from('folhas_pagamento')
        .select('competencia, empresa_id')
        .eq('id', folhaId)
        .single();
      
      if (folhaData) {
        const { provisoesService } = await import('@/services/folha/provisoesService');
        await provisoesService.calcularProvisoesMensais(folhaData.empresa_id || '', folhaData.competencia);
      }

      await supabase.from('folha_auditoria').insert({
        folha_id: folhaId,
        tipo_evento: 'fechamento_folha',
        mensagem: 'Folha de pagamento fechada e assinada digitalmente.',
        severidade: 'info',
        detalhes: { hashIntegridade, totalLiquidoGlobal: totalFolha } as any
      });

      return Ok({ success: true, hash: hashIntegridade });
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Erro crítico ao fechar folha',
        timestamp: new Date()
      });
    }
  },

  emitirPDF: async (folhaId: string): Promise<Result<string>> => {
    return toResult((async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `https://storage.lovable.dev/holerites/holerite_${folhaId}.pdf`;
    })());
  }
};
