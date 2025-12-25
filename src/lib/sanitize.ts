/**
 * @fileoverview Funções de sanitização
 * @module lib/sanitize
 */
/**
 * Utilitários para sanitização de inputs
 * Previne XSS e injection attacks
 */

// Escapa caracteres HTML perigosos
export const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Remove tags HTML
export const stripHtml = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
};

// Sanitiza string para uso seguro
export const sanitizeString = (str: string): string => {
  if (!str) return '';
  return stripHtml(str).trim();
};

// Sanitiza CPF (apenas números)
export const sanitizeCpf = (cpf: string): string => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '').slice(0, 11);
};

// Sanitiza CNPJ (apenas números)
export const sanitizeCnpj = (cnpj: string): string => {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '').slice(0, 14);
};

// Sanitiza telefone
export const sanitizeTelefone = (tel: string): string => {
  if (!tel) return '';
  return tel.replace(/\D/g, '').slice(0, 11);
};

// Sanitiza email
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

// Sanitiza valor monetário
export const sanitizeMonetario = (valor: string | number): number => {
  if (typeof valor === 'number') return Math.max(0, valor);
  if (!valor) return 0;
  const num = parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
  return isNaN(num) ? 0 : Math.max(0, num);
};

// Sanitiza objeto inteiro
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
};

// Sanitiza dados de colaborador
export const sanitizeColaborador = (data: Record<string, unknown>): Record<string, unknown> => {
  return {
    ...data,
    nome_completo: sanitizeString(data.nome_completo as string || ''),
    cpf: sanitizeCpf(data.cpf as string || ''),
    email: sanitizeEmail(data.email as string || ''),
    telefone: sanitizeTelefone(data.telefone as string || ''),
  };
};

// Previne SQL injection em strings (para uso em queries raw)
export const escapeSql = (str: string): string => {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
};
