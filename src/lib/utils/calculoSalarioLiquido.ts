/**
 * Cálculo de Salário Líquido
 * Considera INSS, IRRF e demais descontos legais
 * Tabelas atualizadas para 2025
 */

// Tabela INSS 2025
const TABELA_INSS_2025 = [
  { limite: 1412.00, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 }
];
const TETO_INSS = 908.85;

// Tabela IRRF 2025
const TABELA_IRRF_2025 = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
];
const DEDUCAO_DEPENDENTE = 189.59;

export interface DadosSalario {
  salarioBruto: number;
  horasExtras?: number;
  adicionalNoturno?: number;
  comissoes?: number;
  gratificacoes?: number;
  insalubridade?: number;
  periculosidade?: number;
  dependentes?: number;
  valeTransporte?: number;
  valeAlimentacao?: number;
  planoSaude?: number;
  pensaoAlimenticia?: number;
  outrosDescontos?: number;
}

export interface ResultadoCalculo {
  salarioBruto: number;
  totalProventos: number;
  baseINSS: number;
  descontoINSS: number;
  aliquotaEfetivaINSS: number;
  baseIRRF: number;
  descontoIRRF: number;
  aliquotaEfetivaIRRF: number;
  descontoValeTransporte: number;
  descontoValeAlimentacao: number;
  descontoPlanoSaude: number;
  pensaoAlimenticia: number;
  outrosDescontos: number;
  totalDescontos: number;
  salarioLiquido: number;
}

/**
 * Calcula o desconto do INSS progressivo
 */
export function calcularINSS(salario: number): { valor: number; aliquotaEfetiva: number } {
  let inss = 0;
  let salarioRestante = salario;
  let faixaAnterior = 0;

  for (const faixa of TABELA_INSS_2025) {
    if (salarioRestante <= 0) break;
    
    const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
    inss += baseCalculo * faixa.aliquota;
    salarioRestante -= baseCalculo;
    faixaAnterior = faixa.limite;
  }

  inss = Math.min(inss, TETO_INSS);
  const aliquotaEfetiva = salario > 0 ? (inss / salario) * 100 : 0;

  return { valor: Math.round(inss * 100) / 100, aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100 };
}

/**
 * Calcula o desconto do IRRF
 */
export function calcularIRRF(baseCalculo: number, dependentes: number = 0): { valor: number; aliquotaEfetiva: number } {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE;
  const baseIRRF = baseCalculo - deducaoDependentes;

  if (baseIRRF <= 0) return { valor: 0, aliquotaEfetiva: 0 };

  let irrf = 0;
  for (const faixa of TABELA_IRRF_2025) {
    if (baseIRRF <= faixa.limite) {
      irrf = baseIRRF * faixa.aliquota - faixa.deducao;
      break;
    }
  }

  irrf = Math.max(0, irrf);
  const aliquotaEfetiva = baseCalculo > 0 ? (irrf / baseCalculo) * 100 : 0;

  return { valor: Math.round(irrf * 100) / 100, aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100 };
}

/**
 * Calcula o desconto de Vale Transporte (máximo 6% do salário base)
 */
export function calcularDescontoVT(salarioBase: number, valorVT: number): number {
  const maxDesconto = salarioBase * 0.06;
  return Math.round(Math.min(valorVT, maxDesconto) * 100) / 100;
}

/**
 * Calcula o salário líquido completo
 */
export function calcularSalarioLiquido(dados: DadosSalario): ResultadoCalculo {
  const {
    salarioBruto,
    horasExtras = 0,
    adicionalNoturno = 0,
    comissoes = 0,
    gratificacoes = 0,
    insalubridade = 0,
    periculosidade = 0,
    dependentes = 0,
    valeTransporte = 0,
    valeAlimentacao = 0,
    planoSaude = 0,
    pensaoAlimenticia = 0,
    outrosDescontos = 0
  } = dados;

  // Total de proventos
  const totalProventos = salarioBruto + horasExtras + adicionalNoturno + comissoes + gratificacoes + insalubridade + periculosidade;

  // Cálculo INSS
  const { valor: descontoINSS, aliquotaEfetiva: aliquotaEfetivaINSS } = calcularINSS(totalProventos);

  // Cálculo IRRF (base = proventos - INSS - pensão)
  const baseIRRF = totalProventos - descontoINSS - pensaoAlimenticia;
  const { valor: descontoIRRF, aliquotaEfetiva: aliquotaEfetivaIRRF } = calcularIRRF(baseIRRF, dependentes);

  // Demais descontos
  const descontoValeTransporte = calcularDescontoVT(salarioBruto, valeTransporte);

  // Total de descontos
  const totalDescontos = descontoINSS + descontoIRRF + descontoValeTransporte + valeAlimentacao + planoSaude + pensaoAlimenticia + outrosDescontos;

  // Salário líquido
  const salarioLiquido = totalProventos - totalDescontos;

  return {
    salarioBruto,
    totalProventos: Math.round(totalProventos * 100) / 100,
    baseINSS: Math.round(totalProventos * 100) / 100,
    descontoINSS,
    aliquotaEfetivaINSS,
    baseIRRF: Math.round(baseIRRF * 100) / 100,
    descontoIRRF,
    aliquotaEfetivaIRRF,
    descontoValeTransporte,
    descontoValeAlimentacao: valeAlimentacao,
    descontoPlanoSaude: planoSaude,
    pensaoAlimenticia,
    outrosDescontos,
    totalDescontos: Math.round(totalDescontos * 100) / 100,
    salarioLiquido: Math.round(salarioLiquido * 100) / 100
  };
}

export default { calcularINSS, calcularIRRF, calcularDescontoVT, calcularSalarioLiquido };
