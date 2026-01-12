// V17-C003: Calculadora de Adicional de Periculosidade
export const PERCENTUAL_PERICULOSIDADE = 30;

export interface ParamsPericulosidade {
  salarioBase: number;
  percentual?: number;
}

export function calcularPericulosidade(params: ParamsPericulosidade): number {
  const { salarioBase, percentual = PERCENTUAL_PERICULOSIDADE } = params;
  return Math.round(salarioBase * (percentual / 100) * 100) / 100;
}

export function calcularSalarioComPericulosidade(salarioBase: number): number {
  return salarioBase + calcularPericulosidade({ salarioBase });
}
