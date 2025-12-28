/**
 * calculoProRata
 * Utilitário de cálculos trabalhistas - Departamento Pessoal
 */

interface CalculoParams {
  salarioBase: number;
  horasTrabalhadas?: number;
  percentual?: number;
  diasTrabalhados?: number;
}

interface CalculoResult {
  valor: number;
  descricao: string;
  formula: string;
  detalhes: Record<string, number>;
}

export const calculoProRata = {
  /**
   * Calcula o valor
   */
  calcular(params: CalculoParams): CalculoResult {
    const { salarioBase, horasTrabalhadas = 220, percentual = 0, diasTrabalhados = 30 } = params;
    
    const valorHora = salarioBase / horasTrabalhadas;
    const valor = valorHora * (percentual / 100) * diasTrabalhados;
    
    return {
      valor: Math.round(valor * 100) / 100,
      descricao: 'calculoProRata',
      formula: 'salarioBase / horasTrabalhadas * percentual * diasTrabalhados',
      detalhes: {
        salarioBase,
        valorHora,
        percentual,
        diasTrabalhados,
      },
    };
  },

  /**
   * Valida os parâmetros
   */
  validar(params: CalculoParams): boolean {
    return params.salarioBase > 0;
  },

  /**
   * Formata o resultado
   */
  formatar(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  },
};

export default calculoProRata;
