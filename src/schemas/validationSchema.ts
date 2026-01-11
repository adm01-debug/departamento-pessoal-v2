// V15-108: src/schemas/validationSchema.ts
import { z } from 'zod';

// CPF Validation
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
export const cpfSchema = z.string().regex(cpfRegex, 'CPF inválido').refine(val => {
  const cpf = val.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11; if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11; if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}, 'CPF inválido');

// CNPJ Validation
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
export const cnpjSchema = z.string().regex(cnpjRegex, 'CNPJ inválido');

// Phone Validation
export const phoneSchema = z.string().regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$/, 'Telefone inválido');

// CEP Validation
export const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido');

// PIS Validation
export const pisSchema = z.string().regex(/^\d{3}\.\d{5}\.\d{2}-\d{1}$|^\d{11}$/, 'PIS inválido');

// Email
export const emailSchema = z.string().email('Email inválido');

// Date BR
export const dateBRSchema = z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida (DD/MM/AAAA)');

// Currency BR
export const currencyBRSchema = z.string().regex(/^R$\s?\d{1,3}(\.\d{3})*,\d{2}$/, 'Valor inválido');

// Common schemas
export const colaboradorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: phoneSchema.optional(),
  data_nascimento: z.string().optional(),
  data_admissao: z.string(),
  salario: z.number().positive('Salário deve ser positivo'),
});

export const empresaSchema = z.object({
  razao_social: z.string().min(3),
  cnpj: cnpjSchema,
  email: emailSchema,
  telefone: phoneSchema.optional(),
});
