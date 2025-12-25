/**
 * @fileoverview Schema Zod para empresas
 * @module lib/schemasEmpresa
 */
import { z } from 'zod';
import { validarCNPJ } from './validators';

export const empresaSchema = z.object({
  razao_social: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  nome_fantasia: z.string().max(200).optional(),
  cnpj: z.string().refine(validarCNPJ, 'CNPJ inválido'),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  endereco: z.object({
    cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    logradouro: z.string().min(1, 'Logradouro obrigatório'),
    numero: z.string().min(1, 'Número obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro obrigatório'),
    cidade: z.string().min(1, 'Cidade obrigatória'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  }),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  ativa: z.boolean().default(true),
});

export const filialSchema = empresaSchema.extend({
  matriz_id: z.string().uuid('ID da matriz inválido'),
  codigo_filial: z.string().min(1, 'Código obrigatório'),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;
export type FilialFormData = z.infer<typeof filialSchema>;
