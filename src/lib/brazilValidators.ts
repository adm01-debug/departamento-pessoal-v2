/**
 * Utilitários de validação e formatação para dados brasileiros
 */

// ============== CPF ==============
export function validarCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cleanCPF.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleanCPF.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cleanCPF.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cleanCPF.charAt(10));
}

export function formatarCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ============== CNPJ ==============
export function validarCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  let tamanho = cleanCNPJ.length - 2;
  let numeros = cleanCNPJ.substring(0, tamanho);
  const digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cleanCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado === parseInt(digitos.charAt(1));
}

export function formatarCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// ============== TELEFONE ==============
export function formatarTelefone(telefone: string): string {
  const clean = telefone.replace(/\D/g, '');
  if (clean.length === 11) return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (clean.length === 10) return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return telefone;
}

// ============== CEP ==============
export function formatarCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// ============== MOEDA ==============
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export function parseMoeda(valor: string): number {
  const clean = valor.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

// ============== DATA ==============
export function formatarDataBR(data: string | Date): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  return d.toLocaleDateString('pt-BR');
}

export function parseDataBR(data: string): Date | null {
  const [dia, mes, ano] = data.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  return new Date(ano, mes - 1, dia);
}

export function formatarDataISO(data: string): string {
  const d = parseDataBR(data);
  return d ? d.toISOString().split('T')[0] : data;
}

// ============== PORCENTAGEM ==============
export function formatarPorcentagem(valor: number, decimais = 2): string {
  return `${valor.toFixed(decimais)}%`;
}

// ============== PIS/PASEP ==============
export function formatarPIS(pis: string): string {
  const clean = pis.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
}

// ============== Zod Schemas ==============
import { z } from 'zod';

export const cpfSchema = z.string().refine(validarCPF, { message: 'CPF inválido' });
export const cnpjSchema = z.string().refine(validarCNPJ, { message: 'CNPJ inválido' });
export const telefoneSchema = z.string().regex(/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/, 'Telefone inválido');
export const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido');
export const dataBRSchema = z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida (dd/mm/aaaa)');
export const emailSchema = z.string().email('E-mail inválido');
