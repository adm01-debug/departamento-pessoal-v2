/**
 * @fileoverview Funções de formatação centralizadas para o sistema de DP
 * @module lib/formatters
 */

/**
 * Formata um número como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata um CPF com pontuação
 * @param cpf - CPF com ou sem formatação
 * @returns CPF formatado (ex: "123.456.789-00")
 * @example
 * formatCPF("12345678900") // "123.456.789-00"
 */
export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ com pontuação
 * @param cnpj - CNPJ com ou sem formatação
 * @returns CNPJ formatado (ex: "12.345.678/0001-90")
 * @example
 * formatCNPJ("12345678000190") // "12.345.678/0001-90"
 */
export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata um número de telefone brasileiro
 * @param phone - Telefone com ou sem formatação
 * @returns Telefone formatado (ex: "(11) 98765-4321" ou "(11) 3456-7890")
 * @example
 * formatPhone("11987654321") // "(11) 98765-4321"
 * formatPhone("1134567890") // "(11) 3456-7890"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

/**
 * Formata um CEP com hífen
 * @param cep - CEP com ou sem formatação
 * @returns CEP formatado (ex: "12345-678")
 * @example
 * formatCEP("12345678") // "12345-678"
 */
export function formatCEP(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata uma data no padrão brasileiro (dd/mm/yyyy)
 * @param date - Data como string ISO ou objeto Date
 * @returns Data formatada (ex: "25/12/2024")
 * @example
 * formatDate(new Date("2024-12-25")) // "25/12/2024"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data e hora no padrão brasileiro
 * @param date - Data como string ISO ou objeto Date
 * @returns Data e hora formatadas (ex: "25/12/2024, 14:30:00")
 * @example
 * formatDateTime(new Date("2024-12-25T14:30:00")) // "25/12/2024, 14:30:00"
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
}

/**
 * Formata um número como porcentagem
 * @param value - Valor numérico
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Porcentagem formatada (ex: "12.50%")
 * @example
 * formatPercentage(12.5) // "12.50%"
 * formatPercentage(12.5, 0) // "13%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Converte minutos para formato de horas (HH:MM)
 * @param minutes - Total de minutos
 * @returns Tempo formatado (ex: "08:30")
 * @example
 * formatHours(510) // "08:30"
 */
export function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Formata um número PIS/PASEP com pontuação
 * @param pis - PIS com ou sem formatação
 * @returns PIS formatado (ex: "123.45678.90-1")
 * @example
 * formatPIS("12345678901") // "123.45678.90-1"
 */
export function formatPIS(pis: string): string {
  const digits = pis.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
}

/**
 * Converte uma data no formato brasileiro (dd/mm/yyyy) para objeto Date
 * @param dateStr - Data no formato dd/mm/yyyy
 * @returns Objeto Date correspondente
 * @example
 * parseDate("25/12/2024") // Date object for Dec 25, 2024
 */
export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Converte uma string de moeda brasileira para número
 * @param value - Valor no formato de moeda (ex: "R$ 1.234,56")
 * @returns Valor numérico
 * @example
 * parseCurrency("R$ 1.234,56") // 1234.56
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
}
