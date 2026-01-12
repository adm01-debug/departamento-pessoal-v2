// V17-C018: Calculadora de Salário Família
export const LIMITE_SALARIO_FAMILIA_2025 = 1819.26;
export const VALOR_COTA_2025 = 62.04;

export interface ParamsSalarioFamilia {
  salario: number;
  filhosMenores14: number;
  filhosInvalidos?: number;
}

export interface ResultSalarioFamilia {
  temDireito: boolean;
  valorCota: number;
  quantidadeCotas: number;
  valorTotal: number;
}

export function calcularSalarioFamilia(params: ParamsSalarioFamilia): ResultSalarioFamilia {
  const { salario, filhosMenores14, filhosInvalidos = 0 } = params;
  const temDireito = salario <= LIMITE_SALARIO_FAMILIA_2025;
  const quantidadeCotas = filhosMenores14 + filhosInvalidos;
  const valorTotal = temDireito ? Math.round(VALOR_COTA_2025 * quantidadeCotas * 100) / 100 : 0;
  return { temDireito, valorCota: VALOR_COTA_2025, quantidadeCotas, valorTotal };
}
