// V18: Calculadora de PLR/PPR - Atualizada 2026
import { DEDUCAO_DEPENDENTE_IRRF_2026 } from '@/constants/tabelas.constants';

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
  aliquotaEfetiva: number;
}

// Tabela PLR 2026 (estimada com reajuste)
const TABELA_PLR_2026 = [
  { ate: 8000.00, aliquota: 0, deducao: 0 },
  { ate: 10400.00, aliquota: 7.5, deducao: 600.00 },
  { ate: 13800.00, aliquota: 15, deducao: 1380.00 },
  { ate: 17200.00, aliquota: 22.5, deducao: 2415.00 },
  { ate: Infinity, aliquota: 27.5, deducao: 3275.00 },
];

/**
 * Calcula PLR/PPR com IRRF específico
 */
export function calcularPLR(params: ParamsPLR): ResultPLR {
  const { valorBruto, mesesTrabalhados = 12, dependentesIR = 0 } = params;
  
  // Proporcional aos meses trabalhados
  const proporcional = Math.round((valorBruto / 12) * mesesTrabalhados * 100) / 100;
  
  // Dedução por dependentes
  const deducaoDep = dependentesIR * DEDUCAO_DEPENDENTE_IRRF_2026;
  const base = Math.max(0, proporcional - deducaoDep);
  
  // Calcular IRRF pela tabela PLR
  let irrf = 0;
  for (const faixa of TABELA_PLR_2026) {
    if (base <= faixa.ate) {
      irrf = Math.max(0, base * (faixa.aliquota / 100) - faixa.deducao);
      break;
    }
  }
  irrf = Math.round(irrf * 100) / 100;
  
  const liquido = Math.round((proporcional - irrf) * 100) / 100;
  const aliquotaEfetiva = proporcional > 0 ? Math.round((irrf / proporcional) * 10000) / 100 : 0;
  
  return { 
    bruto: valorBruto, 
    proporcional, 
    irrf, 
    liquido,
    aliquotaEfetiva
  };
}

/**
 * Simula PLR para diferentes valores
 */
export function simularPLR(valores: number[], dependentes: number = 0): ResultPLR[] {
  return valores.map(v => calcularPLR({ valorBruto: v, dependentesIR: dependentes }));
}

/**
 * Obtém tabela PLR atual
 */
export function getTabelaPLR() {
  return TABELA_PLR_2026;
}

export default calcularPLR;
