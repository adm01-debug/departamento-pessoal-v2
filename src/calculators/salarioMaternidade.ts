// V17-C015: Calculadora de Salário Maternidade
export const TETO_INSS_2025 = 8157.41;
export const DIAS_LICENCA_MATERNIDADE = 120;
export const DIAS_LICENCA_EMPRESA_CIDADA = 180;

export interface ParamsMaternidade {
  salario: number;
  empresaCidada?: boolean;
  adocao?: boolean;
  idadeCriancaAdocao?: number;
}

export interface ResultMaternidade {
  diasLicenca: number;
  valorMensal: number;
  valorTotal: number;
  pagoINSS: number;
  pagoEmpresa: number;
}

export function calcularSalarioMaternidade(params: ParamsMaternidade): ResultMaternidade {
  const { salario, empresaCidada = false, adocao = false, idadeCriancaAdocao = 0 } = params;
  let diasLicenca = empresaCidada ? DIAS_LICENCA_EMPRESA_CIDADA : DIAS_LICENCA_MATERNIDADE;
  if (adocao && idadeCriancaAdocao > 0) diasLicenca = idadeCriancaAdocao <= 1 ? 120 : idadeCriancaAdocao <= 4 ? 60 : 30;
  const salarioLimitado = Math.min(salario, TETO_INSS_2025);
  const valorDia = salarioLimitado / 30;
  const valorTotal = Math.round(valorDia * diasLicenca * 100) / 100;
  const pagoINSS = Math.round(valorDia * 120 * 100) / 100;
  const pagoEmpresa = empresaCidada ? Math.round(valorDia * 60 * 100) / 100 : 0;
  return { diasLicenca, valorMensal: salarioLimitado, valorTotal, pagoINSS, pagoEmpresa };
}
