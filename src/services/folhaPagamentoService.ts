import { supabase } from '@/integrations/supabase/client';
import { folhaCalc, CalculoResultado } from '@/utils/folhaCalc';

export interface HoleriteData extends CalculoResultado {
  colaboradorNome: string;
  cpf: string;
  cargo: string;
  dataAdmissao: string;
  competencia: string;
  empresaNome: string;
  cnpj: string;
}

export const folhaPagamentoService = {
  /**
   * Gera os dados para um holerite (contracheque)
   */
  gerarDadosHolerite: async (folhaId: string, colaboradorId: string): Promise<HoleriteData> => {
    // 1. Busca dados do item da folha, do colaborador e da empresa (via folha header)
    const { data: item, error: itemError } = await supabase
      .from('folha_itens')
      .select(`
        *,
        colaborador:colaboradores(*),
        folha:folhas_pagamento(
          *,
          empresa:empresas(*)
        )
      `)
      .eq('folha_id', folhaId)
      .eq('colaborador_id', colaboradorId)
      .single();

    if (itemError || !item) throw new Error('Dados da folha não encontrados para este colaborador');

    // Type casting for nested objects due to Supabase join complexities
    const colab = item.colaborador as any;
    const folhaHeader = item.folha as any;
    const emp = folhaHeader.empresa as any;
    const detalhes = item.detalhes as any;

    return {
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
      colaboradorNome: colab.nome_completo,
      cpf: colab.cpf,
      cargo: colab.cargo || 'Não informado',
      dataAdmissao: colab.data_admissao,
      competencia: folhaHeader.competencia,
      empresaNome: emp.razao_social,
      cnpj: emp.cnpj
    };
  },

  /**
   * Simula a emissão de PDF (seria integrado com uma Edge Function de PDF)
   */
  emitirPDF: async (folhaId: string): Promise<string> => {
    // Simulando delay de geração
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `https://storage.lovable.dev/holerites/holerite_${folhaId}.pdf`;
  }
};
