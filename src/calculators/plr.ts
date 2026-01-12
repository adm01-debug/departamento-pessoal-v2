// V17-C014: Calculadora de PLR/PPR
import { calcularIRRF } from './irrf';

export interface ParamsPLR {
  valorBruto: number;
  mesesTrabalhados?: number;
  dependentesIR?: number;
}

export interface ResultPLR {
  bruto: number;
  proporcional: number;
  irrf: number;
  liquido: number;
}

const TABELA_PLR_2025 = [
  { ate: 7640.80, aliquota: 0, deducao: 0 },
  { ate: 9922.28, aliquota: 7.5, deducao: 573.06 },
  { ate: 13167.00, aliquota: 15, deducao: 1317.23 },
  { ate: 16380.38, aliquota: 22.5, deducao: 2304.76 },
  { ate: Infinity, aliquota: 27.5, deducao: 3123.78 },
];

export function calcularPLR(params: ParamsPLR): ResultPLR {
  const { valorBruto, mesesTrabalhados = 12, dependentesIR = 0 } = params;
  const proporcional = Math.round((valorBruto / 12) * mesesTrabalhados * 100) / 100;
  const deducaoDep = dependentesIR * 189.59;
  const base = proporcional - deducaoDep;
  let irrf = 0;
  for (const f of TABELA_PLR_2025) {
    if (base <= f.ate) { irrf = Math.max(0, base * (f.aliquota / 100) - f.deducao); break; }
  }
  irrf = Math.round(irrf * 100) / 100;
  return { bruto: valorBruto, proporcional, irrf, liquido: Math.round((proporcional - irrf) * 100) / 100 };
}
