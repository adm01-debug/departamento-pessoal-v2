// V20-004: Calculadora Contribuicao Sindical
export interface ContribuicaoSindicalParams {
  salarioBase: number;
  categoria: 'empregado' | 'autonomo' | 'empregador';
  optante: boolean;
}

export interface ResultadoContribuicaoSindical {
  valor: number;
  base: number;
  percentual: number;
  obrigatorio: boolean;
  descricao: string;
}

// Tabela de contribuição sindical (Reforma Trabalhista - facultativa)
export function calcularContribuicaoSindical(params: ContribuicaoSindicalParams): ResultadoContribuicaoSindical {
  const { salarioBase, categoria, optante } = params;

  if (!optante) {
    return {
      valor: 0,
      base: salarioBase,
      percentual: 0,
      obrigatorio: false,
      descricao: 'Contribuição sindical é facultativa desde a Reforma Trabalhista (Lei 13.467/2017)'
    };
  }

  // Valor equivalente a 1 dia de trabalho
  const valorDia = salarioBase / 30;
  const valor = Math.round(valorDia * 100) / 100;

  return {
    valor,
    base: salarioBase,
    percentual: Math.round((valor / salarioBase) * 10000) / 100,
    obrigatorio: false,
    descricao: `Contribuição sindical ${categoria} - equivalente a 1 dia de trabalho`
  };
}

export function calcularContribuicaoAssistencial(salarioBase: number, percentual: number = 1): number {
  return Math.round(salarioBase * percentual / 100 * 100) / 100;
}

export function calcularContribuicaoConfederativa(salarioBase: number, percentual: number = 0.5): number {
  return Math.round(salarioBase * percentual / 100 * 100) / 100;
}
