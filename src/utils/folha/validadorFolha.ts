import { supabase } from '@/integrations/supabase/client';

export interface AlertaConsistencia {
  colaboradorId: string;
  nome: string;
  tipo: 'variacao_salarial' | 'desconto_excessivo' | 'liquido_negativo' | 'falta_informacao';
  mensagem: string;
  gravidade: 'alta' | 'media' | 'baixa';
}

export const validadorFolha = {
  /**
   * Valida a consistência de uma folha já calculada (itens)
   */
  validarFolha: async (folhaId: string): Promise<AlertaConsistencia[]> => {
    const alertas: AlertaConsistencia[] = [];

    // 1. Busca os itens da folha atual
    const { data: itens, error } = await supabase
      .from('folha_itens')
      .select('*, colaborador:colaboradores(nome_completo, salario_base)')
      .eq('folha_id', folhaId);

    if (error || !itens) return [];

    // 2. Regras de validação
    for (const item of itens) {
      const colab = item.colaborador as any;
      const totalProventos = Number(item.total_proventos);
      const totalDescontos = Number(item.total_descontos);
      const totalLiquido = Number(item.total_liquido);

      // Regra 1: Líquido negativo ou zero
      if (totalLiquido <= 0) {
        alertas.push({
          colaboradorId: item.colaborador_id,
          nome: colab.nome_completo,
          tipo: 'liquido_negativo',
          mensagem: 'Salário líquido é zero ou negativo.',
          gravidade: 'alta'
        });
      }

      // Regra 2: Descontos > 70% do bruto (limite legal/prudencial)
      if (totalDescontos > (totalProventos * 0.7)) {
        alertas.push({
          colaboradorId: item.colaborador_id,
          nome: colab.nome_completo,
          tipo: 'desconto_excessivo',
          mensagem: `Descontos representam ${( (totalDescontos/totalProventos)*100 ).toFixed(1)}% do total bruto.`,
          gravidade: 'media'
        });
      }

      // Regra 3: Variação contra Salário Base (exclui HE/DSR normais se possível)
      // Se o total bruto for > 50% do salário base, pode ser um erro ou uma bonificação alta
      if (totalProventos > (Number(colab.salario_base) * 1.5)) {
        alertas.push({
          colaboradorId: item.colaborador_id,
          nome: colab.nome_completo,
          tipo: 'variacao_salarial',
          mensagem: 'Total bruto 50% maior que o salário base. Verifique bonificações.',
          gravidade: 'media'
        });
      }
    }

    return alertas;
  }
};
