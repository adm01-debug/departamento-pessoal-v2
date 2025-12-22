// Funções de cálculo trabalhista - INSS, IRRF, FGTS

import { TabelaINSS, TabelaIRRF, ResultadoCalculoINSS, ResultadoCalculoIRRF } from '@/types/folha';

// Tabela INSS 2024 (progressiva)
export const TABELA_INSS_2024: TabelaINSS[] = [
  { faixa: 1, valorInicial: 0, valorFinal: 1412.00, aliquota: 0.075 },
  { faixa: 2, valorInicial: 1412.01, valorFinal: 2666.68, aliquota: 0.09 },
  { faixa: 3, valorInicial: 2666.69, valorFinal: 4000.03, aliquota: 0.12 },
  { faixa: 4, valorInicial: 4000.04, valorFinal: 7786.02, aliquota: 0.14 },
];

// Tabela IRRF 2024
export const TABELA_IRRF_2024: TabelaIRRF[] = [
  { faixa: 1, valorInicial: 0, valorFinal: 2259.20, aliquota: 0, deducao: 0 },
  { faixa: 2, valorInicial: 2259.21, valorFinal: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { faixa: 3, valorInicial: 2826.66, valorFinal: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { faixa: 4, valorInicial: 3751.06, valorFinal: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { faixa: 5, valorInicial: 4664.69, valorFinal: 999999999, aliquota: 0.275, deducao: 896.00 },
];

// Parâmetros gerais 2024
export const TETO_INSS = 7786.02;
export const SALARIO_MINIMO = 1412.00;
export const DEDUCAO_DEPENDENTE_IRRF = 189.59;
export const ALIQUOTA_FGTS = 0.08;
export const ALIQUOTA_INSS_PATRONAL = 0.20;

/**
 * Calcula o INSS usando a tabela progressiva
 * O cálculo progressivo aplica cada alíquota apenas sobre a parcela correspondente
 */
export function calcularINSS(salarioBruto: number): ResultadoCalculoINSS {
  const baseCalculo = Math.min(salarioBruto, TETO_INSS);
  let valorINSS = 0;
  const detalhamento: { faixa: number; base: number; aliquota: number; valor: number }[] = [];
  
  let valorRestante = baseCalculo;
  
  for (const faixa of TABELA_INSS_2024) {
    if (valorRestante <= 0) break;
    
    const limiteInferior = faixa.valorInicial;
    const limiteSuperior = faixa.valorFinal;
    const amplitudeFaixa = limiteSuperior - limiteInferior + (faixa.faixa === 1 ? limiteInferior : 0.01);
    
    let baseNaFaixa: number;
    
    if (faixa.faixa === 1) {
      // Primeira faixa: do 0 até o limite
      baseNaFaixa = Math.min(valorRestante, limiteSuperior);
    } else {
      // Demais faixas: apenas o que excede o limite inferior
      if (baseCalculo > limiteInferior) {
        baseNaFaixa = Math.min(baseCalculo - limiteInferior + 0.01, limiteSuperior - limiteInferior + 0.01);
        if (baseCalculo <= limiteSuperior) {
          baseNaFaixa = baseCalculo - limiteInferior + 0.01;
        }
      } else {
        baseNaFaixa = 0;
      }
    }
    
    if (baseNaFaixa > 0) {
      const valorFaixa = baseNaFaixa * faixa.aliquota;
      valorINSS += valorFaixa;
      
      detalhamento.push({
        faixa: faixa.faixa,
        base: baseNaFaixa,
        aliquota: faixa.aliquota * 100,
        valor: valorFaixa,
      });
    }
    
    valorRestante -= baseNaFaixa;
  }
  
  // Recalcular usando método mais preciso
  valorINSS = 0;
  detalhamento.length = 0;
  
  for (const faixa of TABELA_INSS_2024) {
    if (baseCalculo <= 0) break;
    
    const limiteInferior = faixa.faixa === 1 ? 0 : faixa.valorInicial;
    const limiteSuperior = faixa.valorFinal;
    
    if (baseCalculo > limiteInferior) {
      const baseNaFaixa = Math.min(baseCalculo, limiteSuperior) - limiteInferior;
      
      if (baseNaFaixa > 0) {
        const valorFaixa = baseNaFaixa * faixa.aliquota;
        valorINSS += valorFaixa;
        
        detalhamento.push({
          faixa: faixa.faixa,
          base: baseNaFaixa,
          aliquota: faixa.aliquota * 100,
          valor: valorFaixa,
        });
      }
    }
  }
  
  const aliquotaEfetiva = baseCalculo > 0 ? (valorINSS / baseCalculo) * 100 : 0;
  
  return {
    baseCalculo,
    aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100,
    valorINSS: Math.round(valorINSS * 100) / 100,
    detalhamento,
  };
}

/**
 * Calcula o IRRF
 */
export function calcularIRRF(
  baseCalculo: number, 
  valorINSS: number, 
  dependentes: number = 0
): ResultadoCalculoIRRF {
  // Base de cálculo IRRF = Salário - INSS - Dedução por dependente
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF;
  const baseIRRF = baseCalculo - valorINSS - deducaoDependentes;
  
  if (baseIRRF <= 0) {
    return {
      baseCalculo: 0,
      aliquota: 0,
      deducao: 0,
      valorIRRF: 0,
    };
  }
  
  // Encontrar a faixa correspondente
  const faixa = TABELA_IRRF_2024.find(
    f => baseIRRF >= f.valorInicial && baseIRRF <= f.valorFinal
  ) || TABELA_IRRF_2024[0];
  
  // Calcular IRRF
  let valorIRRF = (baseIRRF * faixa.aliquota) - faixa.deducao;
  valorIRRF = Math.max(0, valorIRRF);
  
  return {
    baseCalculo: Math.round(baseIRRF * 100) / 100,
    aliquota: faixa.aliquota * 100,
    deducao: faixa.deducao,
    valorIRRF: Math.round(valorIRRF * 100) / 100,
  };
}

/**
 * Calcula o FGTS
 */
export function calcularFGTS(baseFGTS: number): number {
  return Math.round(baseFGTS * ALIQUOTA_FGTS * 100) / 100;
}

/**
 * Calcula o INSS Patronal
 */
export function calcularINSSPatronal(baseFGTS: number): number {
  return Math.round(baseFGTS * ALIQUOTA_INSS_PATRONAL * 100) / 100;
}

/**
 * Calcula valor de hora extra
 */
export function calcularHoraExtra(salarioBase: number, jornadaMensal: number, percentual: number): number {
  const valorHora = salarioBase / jornadaMensal;
  return Math.round(valorHora * (1 + percentual / 100) * 100) / 100;
}

/**
 * Calcula DSR sobre horas extras
 * DSR = (Total HE / dias úteis) * domingos e feriados
 */
export function calcularDSR(totalHorasExtras: number, diasUteis: number = 26, domingosFeriados: number = 4): number {
  if (diasUteis === 0) return 0;
  return Math.round((totalHorasExtras / diasUteis) * domingosFeriados * 100) / 100;
}

/**
 * Calcula desconto de faltas
 */
export function calcularDescontoFaltas(salarioBase: number, diasFalta: number, diasMes: number = 30): number {
  const valorDia = salarioBase / diasMes;
  return Math.round(valorDia * diasFalta * 100) / 100;
}

/**
 * Calcula desconto de atrasos (em horas)
 */
export function calcularDescontoAtrasos(salarioBase: number, horasAtraso: number, jornadaMensal: number = 220): number {
  const valorHora = salarioBase / jornadaMensal;
  return Math.round(valorHora * horasAtraso * 100) / 100;
}

/**
 * Calcula Vale Transporte (máximo 6% do salário base)
 */
export function calcularValeTransporte(salarioBase: number, valorVT: number): number {
  const maxDesconto = salarioBase * 0.06;
  return Math.min(valorVT, maxDesconto);
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calcula todos os encargos de um colaborador
 */
export interface CalculoCompleto {
  salarioBase: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  inss: ResultadoCalculoINSS;
  irrf: ResultadoCalculoIRRF;
  fgts: number;
  inssPatronal: number;
}

export function calcularFolhaColaborador(
  salarioBase: number,
  proventos: { descricao: string; valor: number; incideINSS: boolean; incideIRRF: boolean; incideFGTS: boolean }[],
  descontos: { descricao: string; valor: number }[],
  dependentes: number = 0
): CalculoCompleto {
  // Calcular bases
  let baseINSS = salarioBase;
  let baseFGTS = salarioBase;
  let totalProventos = salarioBase;
  
  for (const provento of proventos) {
    totalProventos += provento.valor;
    if (provento.incideINSS) baseINSS += provento.valor;
    if (provento.incideFGTS) baseFGTS += provento.valor;
  }
  
  // Calcular INSS
  const inss = calcularINSS(baseINSS);
  
  // Base IRRF (total proventos que incidem IRRF)
  let baseIRRF = salarioBase;
  for (const provento of proventos) {
    if (provento.incideIRRF) baseIRRF += provento.valor;
  }
  
  // Calcular IRRF
  const irrf = calcularIRRF(baseIRRF, inss.valorINSS, dependentes);
  
  // Calcular FGTS
  const fgts = calcularFGTS(baseFGTS);
  
  // Calcular INSS Patronal
  const inssPatronal = calcularINSSPatronal(baseFGTS);
  
  // Total de descontos
  let totalDescontos = inss.valorINSS + irrf.valorIRRF;
  for (const desconto of descontos) {
    totalDescontos += desconto.valor;
  }
  
  // Líquido
  const liquido = totalProventos - totalDescontos;
  
  return {
    salarioBase,
    totalProventos: Math.round(totalProventos * 100) / 100,
    totalDescontos: Math.round(totalDescontos * 100) / 100,
    liquido: Math.round(liquido * 100) / 100,
    inss,
    irrf,
    fgts,
    inssPatronal,
  };
}

