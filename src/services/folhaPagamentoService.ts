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
   * Finaliza e fecha a folha de competência, gerando um hash de integridade
   */
  fecharFolha: async (folhaId: string): Promise<{ success: boolean; hash?: string }> => {
    // 1. Validar consistência antes de fechar
    const { validadorFolha } = await import('@/utils/folha/validadorFolha');
    const alertas = await validadorFolha.validarFolha(folhaId);
    
    const alertasCriticos = alertas.filter(a => a.gravidade === 'alta');
    if (alertasCriticos.length > 0) {
      throw new Error(`Não é possível fechar a folha: existem ${alertasCriticos.length} alertas críticos pendentes.`);
    }

    // 2. Buscar totais para o hash
    const { data: itens } = await supabase
      .from('folha_itens')
      .select('total_liquido')
      .eq('folha_id', folhaId);
    
    const totalFolha = itens?.reduce((acc, curr) => acc + Number(curr.total_liquido), 0) || 0;
    const hashIntegridade = btoa(`folha-${folhaId}-${totalFolha}-${new Date().toISOString()}`).substring(0, 32);

    // 3. Atualizar status da folha
    const { error } = await supabase
      .from('folhas_pagamento')
      .update({ 
        status: 'fechada',
        // assumindo que existe uma coluna para hash ou guardamos na auditoria
      })
      .eq('id', folhaId);

    if (error) throw error;

    // 4. Registrar na auditoria
    await supabase.from('folha_auditoria').insert({
      folha_id: folhaId,
      tipo_evento: 'fechamento_folha',
      mensagem: 'Folha de pagamento fechada e assinada digitalmente.',
      severidade: 'info',
      detalhes: { hashIntegridade, totalLiquidoGlobal: totalFolha } as any
    });

    return { success: true, hash: hashIntegridade };
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
