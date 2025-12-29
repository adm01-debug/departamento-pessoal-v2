/**
 * @fileoverview Utilitários gerais do sistema
 * @module lib/utils
 * @version V8.1 - Expandido por análise QA
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================
// CLASSNAMES
// ============================================

/**
 * Combina classes CSS com suporte a Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata valor para moeda brasileira
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata número com separador de milhares
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata percentual
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formata CPF (###.###.###-##)
 */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ (##.###.###/####-##)
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Formata CEP
 */
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return '';
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR');
}

/**
 * Formata competência (MM/YYYY)
 */
export function formatCompetencia(competencia: string | null | undefined): string {
  if (!competencia) return '';
  const [ano, mes] = competencia.split('-');
  return `${mes}/${ano}`;
}

// ============================================
// VALIDAÇÃO
// ============================================

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string | null | undefined): boolean {
  if (!cpf) return false;
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleaned[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleaned[9])) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleaned[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cleaned[10]);
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cleaned[i]) * pesos1[i];
  }
  let resto = soma % 11;
  const dig1 = resto < 2 ? 0 : 11 - resto;
  if (dig1 !== parseInt(cleaned[12])) return false;
  
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cleaned[i]) * pesos2[i];
  }
  resto = soma % 11;
  const dig2 = resto < 2 ? 0 : 11 - resto;
  return dig2 === parseInt(cleaned[13]);
}

/**
 * Valida email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida PIS/PASEP
 */
export function isValidPIS(pis: string | null | undefined): boolean {
  if (!pis) return false;
  const cleaned = pis.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleaned[i]) * pesos[i];
  }
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;
  return dv === parseInt(cleaned[10]);
}

// ============================================
// LIMPEZA
// ============================================

/**
 * Remove caracteres não numéricos
 */
export function onlyNumbers(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

/**
 * Remove acentos
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Slug para URL
 */
export function slugify(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// DATAS
// ============================================

/**
 * Retorna competência atual (YYYY-MM)
 */
export function getCurrentCompetencia(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

/**
 * Retorna competência anterior
 */
export function getPreviousCompetencia(competencia?: string): string {
  const [ano, mes] = (competencia || getCurrentCompetencia()).split('-').map(Number);
  const date = new Date(ano, mes - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Calcula idade
 */
export function calculateAge(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calcula dias entre datas
 */
export function daysBetween(start: string | Date, end: string | Date): number {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================
// MISC
// ============================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gera ID único
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone de objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica se está no ambiente de desenvolvimento
 */
export function isDev(): boolean {
  return import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';
}

/**
 * Trunca texto
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palavra
 */
export function capitalizeWords(str: string): string {
  return str.split(' ').map(capitalize).join(' ');
}
