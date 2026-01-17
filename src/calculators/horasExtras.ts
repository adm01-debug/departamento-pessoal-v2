// V18: Calculadora de Horas Extras e Adicionais - Documentada
// CLT Art. 59-61 - Horas Extras | Art. 73 - Adicional Noturno

import { HORAS_MES, PERCENTUAL_ADICIONAL_NOTURNO } from "@/constants/tabelas.constants";

export interface ResultadoHoraExtra {
  valorHora: number;
  valorHoraExtra: number;
  totalHoras: number;
  percentualAdicional: number;
  valorTotal: number;
}

export interface ResultadoAdicionalNoturno {
  valorHora: number;
  valorAdicional: number;
  horasNoturnas: number;
  horasReduzidas: number; // 52:30 = 60:00
  valorTotal: number;
}

/**
 * Calcula horas extras
 * @param salarioBase - Salário base mensal
 * @param horas - Quantidade de horas extras
 * @param percentual - Percentual adicional (50% dias úteis, 100% domingos/feriados)
 * @param cargaHoraria - Carga horária mensal (default 220h)
 */
export function calcularHoraExtra(
  salarioBase: number,
  horas: number,
  percentual: number = 50,
  cargaHoraria: number = HORAS_MES
): ResultadoHoraExtra {
  const valorHora = salarioBase / cargaHoraria;
  const multiplicador = 1 + (percentual / 100);
  const valorHoraExtra = valorHora * multiplicador;
  const valorTotal = valorHoraExtra * horas;
  
  return {
    valorHora: Math.round(valorHora * 100) / 100,
    valorHoraExtra: Math.round(valorHoraExtra * 100) / 100,
    totalHoras: horas,
    percentualAdicional: percentual,
    valorTotal: Math.round(valorTotal * 100) / 100
  };
}

/**
 * Calcula adicional noturno (20% entre 22h e 5h)
 * @param salarioBase - Salário base mensal
 * @param horasNoturnas - Horas trabalhadas no período noturno
 * @param cargaHoraria - Carga horária mensal (default 220h)
 */
export function calcularAdicionalNoturno(
  salarioBase: number,
  horasNoturnas: number,
  cargaHoraria: number = HORAS_MES
): ResultadoAdicionalNoturno {
  const valorHora = salarioBase / cargaHoraria;
  const valorAdicional = valorHora * (PERCENTUAL_ADICIONAL_NOTURNO / 100);
  
  // Hora noturna reduzida: 52:30 = 60:00
  const horasReduzidas = Math.round(horasNoturnas * (60 / 52.5) * 100) / 100;
  const valorTotal = valorAdicional * horasNoturnas;
  
  return {
    valorHora: Math.round(valorHora * 100) / 100,
    valorAdicional: Math.round(valorAdicional * 100) / 100,
    horasNoturnas,
    horasReduzidas,
    valorTotal: Math.round(valorTotal * 100) / 100
  };
}

/**
 * Calcula DSR (Descanso Semanal Remunerado) sobre horas extras
 * @param totalVariaveis - Total de horas extras/comissões no mês
 * @param diasUteis - Dias úteis trabalhados no mês
 * @param domingosFeriados - Domingos e feriados no mês (default 4-5)
 */
export function calcularDSR(
  totalVariaveis: number,
  diasUteis: number,
  domingosFeriados?: number
): number {
  if (diasUteis <= 0) return 0;
  
  // Se não informado, estima domingos/feriados
  const domingos = domingosFeriados ?? Math.ceil(30 / 7);
  const dsr = (totalVariaveis / diasUteis) * domingos;
  
  return Math.round(dsr * 100) / 100;
}

/**
 * Calcula horas extras + DSR
 */
export function calcularHorasExtrasComDSR(
  salarioBase: number,
  horas: number,
  percentual: number = 50,
  diasUteis: number = 22,
  domingosFeriados: number = 8
): { horasExtras: ResultadoHoraExtra; dsr: number; total: number } {
  const horasExtras = calcularHoraExtra(salarioBase, horas, percentual);
  const dsr = calcularDSR(horasExtras.valorTotal, diasUteis, domingosFeriados);
  
  return {
    horasExtras,
    dsr,
    total: Math.round((horasExtras.valorTotal + dsr) * 100) / 100
  };
}

export default calcularHoraExtra;
