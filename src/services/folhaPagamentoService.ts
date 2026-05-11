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
    // 1. Busca dados da folha e do colaborador
    const { data: folha, error: folhaError } = await supabase
      .from('folhas_pagamento')
      .select(`
        *,
        colaborador:colaboradores(*),
        empresa:empresas(*)
      `)
      .eq('id', folhaId)
      .single();

    if (folhaError || !folha) throw new Error('Folha não encontrada');

    const colab = folha.colaborador;
    const emp = folha.empresa;

    // 2. Realiza o cálculo usando o utilitário central
    const resultado = folhaCalc.processar(Number(colab.salario_base || 0), {
      adicionais: Number(folha.total_proventos || 0) - Number(colab.salario_base || 0),
      descontosExtras: Number(folha.total_descontos || 0) - (folha.inss || 0) - (folha.irrf || 0),
      dependentes: colab.dependentes || 0
    });

    return {
      ...resultado,
      colaboradorNome: colab.nome_completo,
      cpf: colab.cpf,
      cargo: colab.cargo || 'Não informado',
      dataAdmissao: colab.data_admissao,
      competencia: folha.competencia,
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
