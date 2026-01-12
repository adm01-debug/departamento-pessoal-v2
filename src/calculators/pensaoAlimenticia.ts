// V17-C005: Calculadora de Pensão Alimentícia
export interface ParamsPensao {
  salarioLiquido: number;
  percentual?: number;
  valorFixo?: number;
  beneficiarios?: number;
}

export interface ResultPensao {
  valorTotal: number;
  valorPorBeneficiario: number;
  baseCalculo: number;
}

export function calcularPensaoAlimenticia(params: ParamsPensao): ResultPensao {
  const { salarioLiquido, percentual, valorFixo, beneficiarios = 1 } = params;
  let valorTotal = 0;
  if (valorFixo && valorFixo > 0) {
    valorTotal = valorFixo;
  } else if (percentual && percentual > 0) {
    valorTotal = Math.round(salarioLiquido * (percentual / 100) * 100) / 100;
  }
  const valorPorBeneficiario = Math.round((valorTotal / beneficiarios) * 100) / 100;
  return { valorTotal, valorPorBeneficiario, baseCalculo: salarioLiquido };
}
