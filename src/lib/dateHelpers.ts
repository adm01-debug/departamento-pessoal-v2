/**
 * @fileoverview Funções auxiliares de data
 * @module lib/dateHelpers
 */
import { format, parseISO, differenceInDays, differenceInMonths, differenceInYears, addDays, addMonths, startOfMonth, endOfMonth, isWeekend, isSameDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data para exibição
 */
export function formatarData(data: string | Date, formato = 'dd/MM/yyyy'): string {
  if (!data) return '';
  const date = typeof data === 'string' ? parseISO(data) : data;
  return format(date, formato, { locale: ptBR });
}

/**
 * Formata data e hora
 */
export function formatarDataHora(data: string | Date): string {
  return formatarData(data, "dd/MM/yyyy 'às' HH:mm");
}

/**
 * Calcula diferença em dias
 */
export function diasEntre(inicio: string | Date, fim: string | Date): number {
  const dataInicio = typeof inicio === 'string' ? parseISO(inicio) : inicio;
  const dataFim = typeof fim === 'string' ? parseISO(fim) : fim;
  return differenceInDays(dataFim, dataInicio);
}

/**
 * Calcula idade em anos
 */
export function calcularIdade(dataNascimento: string | Date): number {
  const data = typeof dataNascimento === 'string' ? parseISO(dataNascimento) : dataNascimento;
  return differenceInYears(new Date(), data);
}

/**
 * Calcula tempo de empresa em meses
 */
export function tempoEmpresa(dataAdmissao: string | Date): { anos: number; meses: number } {
  const data = typeof dataAdmissao === 'string' ? parseISO(dataAdmissao) : dataAdmissao;
  const mesesTotal = differenceInMonths(new Date(), data);
  return { anos: Math.floor(mesesTotal / 12), meses: mesesTotal % 12 };
}

/**
 * Verifica se é dia útil
 */
export function isDiaUtil(data: Date): boolean {
  return !isWeekend(data);
}

/**
 * Conta dias úteis entre duas datas
 */
export function diasUteis(inicio: Date, fim: Date): number {
  let count = 0;
  let current = inicio;
  while (!isAfter(current, fim)) {
    if (isDiaUtil(current)) count++;
    current = addDays(current, 1);
  }
  return count;
}

/**
 * Primeiro dia do mês
 */
export function primeiroDiaMes(data: Date = new Date()): Date {
  return startOfMonth(data);
}

/**
 * Último dia do mês
 */
export function ultimoDiaMes(data: Date = new Date()): Date {
  return endOfMonth(data);
}

/**
 * Adiciona dias úteis
 */
export function adicionarDiasUteis(data: Date, dias: number): Date {
  let result = data;
  let added = 0;
  while (added < dias) {
    result = addDays(result, 1);
    if (isDiaUtil(result)) added++;
  }
  return result;
}

export { parseISO, format, addDays, addMonths, isSameDay, isAfter, isBefore };
