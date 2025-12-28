/**
 * Cálculo de Participação nos Lucros e Resultados (PLR)
 * Baseado na Lei 10.101/2000
 */

interface PLRConfig {
  lucroEmpresa: number;
  percentualDistribuicao: number;
  salarioBase: number;
  mesesTrabalhados: number;
  metasAtingidas: number; // 0-100%
}

interface PLRResult {
  valorBruto: number;
  inss: number;
  irrf: number;
  valorLiquido: number;
  detalhamento: {
    baseCalculo: number;
    proporcional: number;
    bonusMetas: number;
  };
}

// Tabela IRRF exclusiva para PLR (2025)
const TABELA_IRRF_PLR = [
  { limite: 7640.80, aliquota: 0, deducao: 0 },
  { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
  { limite: 13167.00, aliquota: 0.15, deducao: 1317.23 },
  { limite: 16380.38, aliquota: 0.225, deducao: 2304.76 },
  { limite: Infinity, aliquota: 0.275, deducao: 3123.78 },
];

export function calcularPLR(config: PLRConfig): PLRResult {
  const { lucroEmpresa, percentualDistribuicao, salarioBase, mesesTrabalhados, metasAtingidas } = config;
  
  // Base de cálculo proporcional
  const proporcional = mesesTrabalhados / 12;
  const baseCalculo = (lucroEmpresa * percentualDistribuicao / 100) * proporcional;
  
  // Bônus por metas atingidas
  const bonusMetas = baseCalculo * (metasAtingidas / 100) * 0.2;
  
  // Valor bruto
  const valorBruto = baseCalculo + bonusMetas;
  
  // INSS não incide sobre PLR
  const inss = 0;
  
  // IRRF exclusivo para PLR
  let irrf = 0;
  for (const faixa of TABELA_IRRF_PLR) {
    if (valorBruto <= faixa.limite) {
      irrf = valorBruto * faixa.aliquota - faixa.deducao;
      break;
    }
  }
  irrf = Math.max(0, irrf);
  
  const valorLiquido = valorBruto - irrf;
  
  return {
    valorBruto: Math.round(valorBruto * 100) / 100,
    inss,
    irrf: Math.round(irrf * 100) / 100,
    valorLiquido: Math.round(valorLiquido * 100) / 100,
    detalhamento: {
      baseCalculo: Math.round(baseCalculo * 100) / 100,
      proporcional,
      bonusMetas: Math.round(bonusMetas * 100) / 100,
    },
  };
}

export function validarPLR(config: PLRConfig): string[] {
  const erros: string[] = [];
  if (config.lucroEmpresa < 0) erros.push('Lucro da empresa não pode ser negativo');
  if (config.percentualDistribuicao < 0 || config.percentualDistribuicao > 100) {
    erros.push('Percentual de distribuição deve estar entre 0 e 100');
  }
  if (config.mesesTrabalhados < 0 || config.mesesTrabalhados > 12) {
    erros.push('Meses trabalhados deve estar entre 0 e 12');
  }
  if (config.metasAtingidas < 0 || config.metasAtingidas > 100) {
    erros.push('Metas atingidas deve estar entre 0 e 100');
  }
  return erros;
}

export default { calcularPLR, validarPLR };
