/**
 * Cálculo de Programa de Participação nos Resultados (PPR)
 * Similar ao PLR mas focado em metas específicas
 */

interface PPRMeta {
  nome: string;
  peso: number;
  atingido: number; // percentual 0-100
}

interface PPRConfig {
  salarioBase: number;
  mesesTrabalhados: number;
  metas: PPRMeta[];
  multiplicadorMaximo: number;
}

interface PPRResult {
  valorBruto: number;
  irrf: number;
  valorLiquido: number;
  percentualAtingido: number;
  detalhamentoPorMeta: Array<{ meta: string; contribuicao: number }>;
}

const TABELA_IRRF_PPR = [
  { limite: 7640.80, aliquota: 0, deducao: 0 },
  { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
  { limite: 13167.00, aliquota: 0.15, deducao: 1317.23 },
  { limite: 16380.38, aliquota: 0.225, deducao: 2304.76 },
  { limite: Infinity, aliquota: 0.275, deducao: 3123.78 },
];

export function calcularPPR(config: PPRConfig): PPRResult {
  const { salarioBase, mesesTrabalhados, metas, multiplicadorMaximo } = config;
  
  // Calcular percentual atingido ponderado
  const totalPeso = metas.reduce((sum, m) => sum + m.peso, 0);
  const percentualAtingido = metas.reduce((sum, m) => {
    return sum + (m.atingido * m.peso / totalPeso);
  }, 0);
  
  // Proporcional aos meses trabalhados
  const proporcional = mesesTrabalhados / 12;
  
  // Valor bruto baseado no salário e multiplicador
  const multiplicador = Math.min(percentualAtingido / 100 * multiplicadorMaximo, multiplicadorMaximo);
  const valorBruto = salarioBase * multiplicador * proporcional;
  
  // IRRF
  let irrf = 0;
  for (const faixa of TABELA_IRRF_PPR) {
    if (valorBruto <= faixa.limite) {
      irrf = valorBruto * faixa.aliquota - faixa.deducao;
      break;
    }
  }
  irrf = Math.max(0, irrf);
  
  // Detalhamento por meta
  const detalhamentoPorMeta = metas.map(m => ({
    meta: m.nome,
    contribuicao: Math.round((m.atingido * m.peso / totalPeso / 100) * valorBruto * 100) / 100,
  }));
  
  return {
    valorBruto: Math.round(valorBruto * 100) / 100,
    irrf: Math.round(irrf * 100) / 100,
    valorLiquido: Math.round((valorBruto - irrf) * 100) / 100,
    percentualAtingido: Math.round(percentualAtingido * 100) / 100,
    detalhamentoPorMeta,
  };
}

export function validarPPR(config: PPRConfig): string[] {
  const erros: string[] = [];
  if (config.salarioBase <= 0) erros.push('Salário base deve ser maior que zero');
  if (config.metas.length === 0) erros.push('Deve haver pelo menos uma meta');
  if (config.multiplicadorMaximo <= 0) erros.push('Multiplicador máximo deve ser maior que zero');
  config.metas.forEach((m, i) => {
    if (m.peso <= 0) erros.push(`Meta ${i + 1}: peso deve ser maior que zero`);
    if (m.atingido < 0 || m.atingido > 100) erros.push(`Meta ${i + 1}: atingido deve estar entre 0 e 100`);
  });
  return erros;
}

export default { calcularPPR, validarPPR };
