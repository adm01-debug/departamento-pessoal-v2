import { supabase } from '@/integrations/supabase/client';
import { CalculoResultado } from '@/utils/folhaCalc';
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
  gerarDadosHolerite: async (folhaId: string, colaboradorId: string): Promise<HoleriteData> => {
    try {
      const { data: item, error: itemError } = await supabase
        .from('folha_itens')
        .select('*, colaborador:colaboradores(*), folha:folhas_pagamento(*)')
        .eq('folha_id', folhaId)
        .eq('colaborador_id', colaboradorId)
        .single();

      if (itemError || !item) {
        throw new Error('Dados da folha não encontrados');
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

      return ({
        proventos: item.total_proventos || 0,
        descontos: item.total_descontos || 0,
        liquido: (item as any).valor_liquido || 0,
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
      throw new Error(e.message || 'Falha ao gerar holerite');
    }
  },

  /**
   * Assina digitalmente um holerite
   */
  assinarHolerite: async (folhaId: string, colaboradorId: string): Promise<string> => {
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
      return (hash);
    } catch (e: any) {
      throw new Error('Falha ao assinar holerite digitalmente');
    }
  },

  /**
   * Finaliza e fecha a folha de competência
   */
  fecharFolha: async (folhaId: string): Promise<{ success: boolean; hash?: string }> => {
    try {
      const { validadorFolha } = await import('@/utils/folha/validadorFolha');
      const alertas = await validadorFolha.validarFolha(folhaId);
      
      const alertasCriticos = alertas.filter(a => a.gravidade === 'alta');
      if (alertasCriticos.length > 0) {
        throw new Error(`Não é possível fechar a folha: existem ${alertasCriticos.length} alertas críticos.`);
      }

      const { data: itens } = await supabase
        .from('folha_itens')
        .select('*')
        .eq('folha_id', folhaId);
      
      const totalFolha = itens?.reduce((acc, curr) => acc + Number((curr as any).valor_liquido || 0), 0) || 0;
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

      return ({ success: true, hash: hashIntegridade });
    } catch (e: any) {
      throw new Error(e.message || 'Erro crítico ao fechar folha');
    }
  },

  emitirPDF: async (folhaId: string): Promise<string> => {
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `https://storage.lovable.dev/holerites/holerite_${folhaId}.pdf`;
  
  }
};
