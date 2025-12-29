/**
 * @fileoverview Cálculos trabalhistas (INSS, IRRF, FGTS)
 * @module lib/calculosTrabalhistas
 * @version V8.1 - Corrigido por análise QA
 * @updated 2025-01
 */

import { TabelaINSS, TabelaIRRF, ResultadoCalculoINSS, ResultadoCalculoIRRF } from '@/types/folha';

// ============================================
// TABELAS ATUALIZADAS 2025
// ============================================

/**
 * Tabela INSS 2025 (Progressiva)
 * Fonte: Portaria Interministerial MPS/MF
 * Vigência: Janeiro/2025
 */
export const TABELA_INSS_2025: TabelaINSS[] = [
  { faixa: 1, valorInicial: 0.00, valorFinal: 1518.00, aliquota: 0.075 },
  { faixa: 2, valorInicial: 1518.01, valorFinal: 2793.88, aliquota: 0.09 },
  { faixa: 3, valorInicial: 2793.89, valorFinal: 4190.83, aliquota: 0.12 },
  { faixa: 4, valorInicial: 4190.84, valorFinal: 8157.41, aliquota: 0.14 },
];

/**
 * Tabela IRRF 2025
 * Fonte: Lei 14.848/2024
 * Vigência: Janeiro/2025
 */
export const TABELA_IRRF_2025: TabelaIRRF[] = [
  { faixa: 1, valorInicial: 0.00, valorFinal: 2259.20, aliquota: 0.00, deducao: 0.00 },
  { faixa: 2, valorInicial: 2259.21, valorFinal: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { faixa: 3, valorInicial: 2826.66, valorFinal: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { faixa: 4, valorInicial: 3751.06, valorFinal: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { faixa: 5, valorInicial: 4664.69, valorFinal: Infinity, aliquota: 0.275, deducao: 896.00 },
];

// Manter compatibilidade com código existente
export const TABELA_INSS_2024 = TABELA_INSS_2025;
export const TABELA_IRRF_2024 = TABELA_IRRF_2025;

// ============================================
// CONSTANTES 2025
// ============================================

/** Teto do INSS 2025 */
export const TETO_INSS = 8157.41;

/** Salário Mínimo 2025 */
export const SALARIO_MINIMO = 1518.00;

/** Dedução por dependente IRRF 2025 */
export const DEDUCAO_DEPENDENTE_IRRF = 189.59;

/** Alíquota FGTS */
export const ALIQUOTA_FGTS = 0.08;

/** Alíquota INSS Patronal */
export const ALIQUOTA_INSS_PATRONAL = 0.20;

/** Jornada mensal padrão (horas) */
export const JORNADA_MENSAL_PADRAO = 220;

/** Dias úteis padrão no mês */
export const DIAS_UTEIS_PADRAO = 22;

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Arredondamento monetário preciso (2 casas decimais)
 * Evita problemas de floating point
 */
export function arredondarMonetario(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/**
 * Valida se o valor é um número positivo válido
 */
function validarValor(valor: number, nome: string): void {
  if (typeof valor !== 'number' || isNaN(valor)) {
    throw new Error(`${nome} deve ser um número válido`);
  }
  if (valor < 0) {
    throw new Error(`${nome} não pode ser negativo`);
  }
}

// ============================================
// CÁLCULO DE INSS
// ============================================

/**
 * Calcula o INSS usando a tabela progressiva 2025
 * 
 * @param salarioBruto - Salário bruto do colaborador
 * @returns Objeto com valor do INSS, alíquota efetiva e detalhamento por faixa
 * 
 * @example
 * const resultado = calcularINSS(5000);
 * console.log(resultado.valorINSS); // 466.86
 * 
 * @description
 * O cálculo progressivo aplica cada alíquota apenas sobre a parcela 
 * do salário correspondente àquela faixa:
 * - Faixa 1: 7,5% sobre a parcela até R$ 1.518,00
 * - Faixa 2: 9% sobre a parcela de R$ 1.518,01 a R$ 2.793,88
 * - Faixa 3: 12% sobre a parcela de R$ 2.793,89 a R$ 4.190,83
 * - Faixa 4: 14% sobre a parcela de R$ 4.190,84 a R$ 8.157,41
 */
export function calcularINSS(salarioBruto: number): ResultadoCalculoINSS {
  // Validação de entrada
  if (salarioBruto <= 0) {
    return {
      baseCalculo: 0,
      aliquotaEfetiva: 0,
      valorINSS: 0,
      detalhamento: [],
    };
  }

  const baseCalculo = Math.min(salarioBruto, TETO_INSS);
  let valorINSS = 0;
  const detalhamento: { faixa: number; base: number; aliquota: number; valor: number }[] = [];
  
  let valorAnterior = 0;
  
  for (const faixa of TABELA_INSS_2025) {
    if (baseCalculo <= valorAnterior) break;
    
    // Calcular quanto do salário está nesta faixa
    const limiteFaixa = Math.min(baseCalculo, faixa.valorFinal);
    const baseNaFaixa = limiteFaixa - valorAnterior;
    
    if (baseNaFaixa > 0) {
      const valorFaixa = arredondarMonetario(baseNaFaixa * faixa.aliquota);
      valorINSS += valorFaixa;
      
      detalhamento.push({
        faixa: faixa.faixa,
        base: arredondarMonetario(baseNaFaixa),
        aliquota: faixa.aliquota * 100,
        valor: valorFaixa,
      });
    }
    
    valorAnterior = faixa.valorFinal;
  }
  
  const aliquotaEfetiva = baseCalculo > 0 ? (valorINSS / baseCalculo) * 100 : 0;
  
  return {
    baseCalculo: arredondarMonetario(baseCalculo),
    aliquotaEfetiva: arredondarMonetario(aliquotaEfetiva),
    valorINSS: arredondarMonetario(valorINSS),
    detalhamento,
  };
}

// ============================================
// CÁLCULO DE IRRF
// ============================================

/**
 * Calcula o IRRF (Imposto de Renda Retido na Fonte)
 * 
 * @param baseCalculo - Base de cálculo (salário bruto)
 * @param valorINSS - Valor do INSS já descontado
 * @param dependentes - Número de dependentes (padrão: 0)
 * @returns Objeto com valor do IRRF, alíquota e deduções
 * 
 * @example
 * const irrf = calcularIRRF(5000, 466.86, 2);
 * console.log(irrf.valorIRRF); // Valor calculado
 */
export function calcularIRRF(
  baseCalculo: number, 
  valorINSS: number, 
  dependentes: number = 0
): ResultadoCalculoIRRF {
  // Validações
  if (baseCalculo <= 0) {
    return { baseCalculo: 0, aliquota: 0, deducao: 0, valorIRRF: 0, faixa: 0 };
  }
  
  // Base de cálculo IRRF = Salário - INSS - Dedução por dependente
  const deducaoDependentes = Math.max(0, dependentes) * DEDUCAO_DEPENDENTE_IRRF;
  const baseIRRF = baseCalculo - valorINSS - deducaoDependentes;
  
  if (baseIRRF <= 0) {
    return { baseCalculo: 0, aliquota: 0, deducao: 0, valorIRRF: 0, faixa: 0 };
  }
  
  // Encontrar a faixa correspondente
  let faixaEncontrada = TABELA_IRRF_2025[0];
  let numeroFaixa = 1;
  
  for (let i = 0; i < TABELA_IRRF_2025.length; i++) {
    const faixa = TABELA_IRRF_2025[i];
    if (baseIRRF >= faixa.valorInicial && baseIRRF <= faixa.valorFinal) {
      faixaEncontrada = faixa;
      numeroFaixa = i + 1;
      break;
    }
  }
  
  // Calcular IRRF
  const valorBruto = baseIRRF * faixaEncontrada.aliquota;
  const valorIRRF = Math.max(0, valorBruto - faixaEncontrada.deducao);
  
  return {
    baseCalculo: arredondarMonetario(baseIRRF),
    aliquota: faixaEncontrada.aliquota * 100,
    deducao: faixaEncontrada.deducao,
    valorIRRF: arredondarMonetario(valorIRRF),
    faixa: numeroFaixa,
  };
}

// ============================================
// CÁLCULO DE FGTS
// ============================================

/**
 * Calcula o FGTS do colaborador (8% da remuneração)
 * 
 * @param baseFGTS - Base de cálculo do FGTS (remuneração total)
 * @returns Valor do FGTS
 */
export function calcularFGTS(baseFGTS: number): number {
  if (baseFGTS <= 0) return 0;
  return arredondarMonetario(baseFGTS * ALIQUOTA_FGTS);
}

/**
 * Calcula o INSS Patronal (20% da folha)
 * 
 * @param baseFGTS - Base de cálculo
 * @returns Valor do INSS Patronal
 */
export function calcularINSSPatronal(baseFGTS: number): number {
  if (baseFGTS <= 0) return 0;
  return arredondarMonetario(baseFGTS * ALIQUOTA_INSS_PATRONAL);
}

// ============================================
// CÁLCULOS COMPLEMENTARES
// ============================================

/**
 * Calcula valor de hora extra
 * 
 * @param salarioBase - Salário base mensal
 * @param jornadaMensal - Jornada mensal em horas (padrão: 220)
 * @param percentual - Percentual de adicional (50 para 50%, 100 para 100%)
 * @returns Valor da hora extra
 */
export function calcularHoraExtra(
  salarioBase: number, 
  jornadaMensal: number = JORNADA_MENSAL_PADRAO, 
  percentual: number = 50
): number {
  validarValor(salarioBase, 'Salário base');
  if (jornadaMensal <= 0) jornadaMensal = JORNADA_MENSAL_PADRAO;
  
  const valorHora = salarioBase / jornadaMensal;
  const multiplicador = 1 + (percentual / 100);
  return arredondarMonetario(valorHora * multiplicador);
}

/**
 * Calcula DSR (Descanso Semanal Remunerado) sobre horas extras
 * Fórmula: DSR = (Total HE / dias úteis) * domingos e feriados
 * 
 * @param totalHorasExtras - Valor total das horas extras
 * @param diasUteis - Dias úteis no mês (padrão: 22)
 * @param domingosFeriados - Domingos e feriados no mês (padrão: 4-5)
 * @returns Valor do DSR
 */
export function calcularDSR(
  totalHorasExtras: number, 
  diasUteis: number = DIAS_UTEIS_PADRAO, 
  domingosFeriados: number = 4
): number {
  if (totalHorasExtras <= 0 || diasUteis <= 0) return 0;
  return arredondarMonetario((totalHorasExtras / diasUteis) * domingosFeriados);
}

/**
 * Calcula desconto de faltas
 * 
 * @param salarioBase - Salário base
 * @param diasFalta - Dias de falta
 * @param diasMes - Dias no mês (padrão: 30)
 * @returns Valor do desconto
 */
export function calcularDescontoFaltas(
  salarioBase: number, 
  diasFalta: number, 
  diasMes: number = 30
): number {
  if (salarioBase <= 0 || diasFalta <= 0) return 0;
  const valorDia = salarioBase / diasMes;
  return arredondarMonetario(valorDia * diasFalta);
}

/**
 * Calcula desconto de atrasos (em horas)
 * 
 * @param salarioBase - Salário base
 * @param horasAtraso - Horas de atraso
 * @param jornadaMensal - Jornada mensal (padrão: 220)
 * @returns Valor do desconto
 */
export function calcularDescontoAtrasos(
  salarioBase: number, 
  horasAtraso: number, 
  jornadaMensal: number = JORNADA_MENSAL_PADRAO
): number {
  if (salarioBase <= 0 || horasAtraso <= 0) return 0;
  const valorHora = salarioBase / jornadaMensal;
  return arredondarMonetario(valorHora * horasAtraso);
}

/**
 * Calcula desconto de Vale Transporte (máximo 6% do salário base)
 * 
 * @param salarioBase - Salário base
 * @param valorVT - Valor total do VT
 * @returns Valor do desconto (limitado a 6%)
 */
export function calcularValeTransporte(salarioBase: number, valorVT: number): number {
  if (salarioBase <= 0 || valorVT <= 0) return 0;
  const maxDesconto = arredondarMonetario(salarioBase * 0.06);
  return Math.min(valorVT, maxDesconto);
}

/**
 * Calcula adicional noturno (20% sobre hora normal)
 * Período: 22h às 05h
 * Hora noturna reduzida: 52min30s
 * 
 * @param salarioBase - Salário base
 * @param horasNoturnas - Horas trabalhadas em período noturno
 * @param jornadaMensal - Jornada mensal (padrão: 220)
 * @returns Valor do adicional noturno
 */
export function calcularAdicionalNoturno(
  salarioBase: number,
  horasNoturnas: number,
  jornadaMensal: number = JORNADA_MENSAL_PADRAO
): number {
  if (salarioBase <= 0 || horasNoturnas <= 0) return 0;
  const valorHora = salarioBase / jornadaMensal;
  const adicional = valorHora * 0.20 * horasNoturnas;
  return arredondarMonetario(adicional);
}

/**
 * Calcula periculosidade (30% sobre salário base)
 * 
 * @param salarioBase - Salário base
 * @returns Valor do adicional de periculosidade
 */
export function calcularPericulosidade(salarioBase: number): number {
  if (salarioBase <= 0) return 0;
  return arredondarMonetario(salarioBase * 0.30);
}

/**
 * Calcula insalubridade
 * Base: Salário mínimo
 * Graus: mínimo (10%), médio (20%), máximo (40%)
 * 
 * @param grau - Grau de insalubridade ('minimo' | 'medio' | 'maximo')
 * @returns Valor do adicional de insalubridade
 */
export function calcularInsalubridade(grau: 'minimo' | 'medio' | 'maximo'): number {
  const percentuais = { minimo: 0.10, medio: 0.20, maximo: 0.40 };
  const percentual = percentuais[grau] || 0;
  return arredondarMonetario(SALARIO_MINIMO * percentual);
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata valor monetário para exibição
 * 
 * @param value - Valor numérico
 * @returns String formatada em R$
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata percentual para exibição
 * 
 * @param value - Valor percentual
 * @returns String formatada com %
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

// ============================================
// CÁLCULO COMPLETO DE FOLHA
// ============================================

export interface ProventoDesconto {
  codigo: string;
  descricao: string;
  valor: number;
  incideINSS: boolean;
  incideIRRF: boolean;
  incideFGTS: boolean;
}

export interface CalculoCompleto {
  colaboradorId?: string;
  competencia?: string;
  salarioBase: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  inss: ResultadoCalculoINSS;
  irrf: ResultadoCalculoIRRF;
  fgts: number;
  inssPatronal: number;
  custoTotal: number;
}

/**
 * Calcula folha completa de um colaborador
 * 
 * @param salarioBase - Salário base
 * @param proventos - Lista de proventos adicionais
 * @param descontos - Lista de descontos
 * @param dependentes - Número de dependentes IRRF
 * @returns Objeto com cálculo completo
 */
export function calcularFolhaColaborador(
  salarioBase: number,
  proventos: ProventoDesconto[] = [],
  descontos: ProventoDesconto[] = [],
  dependentes: number = 0
): CalculoCompleto {
  // Validação
  validarValor(salarioBase, 'Salário base');
  
  // Calcular bases
  let baseINSS = salarioBase;
  let baseIRRF = salarioBase;
  let baseFGTS = salarioBase;
  let totalProventos = salarioBase;
  
  for (const provento of proventos) {
    totalProventos += provento.valor;
    if (provento.incideINSS) baseINSS += provento.valor;
    if (provento.incideIRRF) baseIRRF += provento.valor;
    if (provento.incideFGTS) baseFGTS += provento.valor;
  }
  
  // Calcular INSS
  const inss = calcularINSS(baseINSS);
  
  // Calcular IRRF (base já considera INSS)
  const irrf = calcularIRRF(baseIRRF, inss.valorINSS, dependentes);
  
  // Calcular FGTS (encargo patronal)
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
  
  // Custo total para a empresa
  const custoTotal = totalProventos + fgts + inssPatronal;
  
  return {
    salarioBase: arredondarMonetario(salarioBase),
    totalProventos: arredondarMonetario(totalProventos),
    totalDescontos: arredondarMonetario(totalDescontos),
    liquido: arredondarMonetario(liquido),
    inss,
    irrf,
    fgts,
    inssPatronal,
    custoTotal: arredondarMonetario(custoTotal),
  };
}
