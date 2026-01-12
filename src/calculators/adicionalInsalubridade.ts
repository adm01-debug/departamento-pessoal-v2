// V17-C004: Calculadora de Adicional de Insalubridade
export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo';
export const PERCENTUAIS_INSALUBRIDADE = { minimo: 10, medio: 20, maximo: 40 };
export const SALARIO_MINIMO_2025 = 1518.00;

export interface ParamsInsalubridade {
  grau: GrauInsalubridade;
  baseCalculo?: number;
}

export function calcularInsalubridade(params: ParamsInsalubridade): number {
  const { grau, baseCalculo = SALARIO_MINIMO_2025 } = params;
  const percentual = PERCENTUAIS_INSALUBRIDADE[grau];
  return Math.round(baseCalculo * (percentual / 100) * 100) / 100;
}
