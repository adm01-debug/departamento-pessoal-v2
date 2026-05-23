import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';

export const metricasSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
});

export const webhookSchema = z.object({
  event: z.string().min(1, 'Evento é obrigatório'),
  data: z.record(z.any()),
  timestamp: z.string().datetime().optional(),
  version: z.string().optional().default('v1'),
});

export const healthcheckSchema = z.object({}).strict();

export const cepSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve ter 8 dígitos (pode conter hífen)'),
});

export const cnpjSchema = z.object({
  cnpj: z.string().regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ inválido'),
});

export const holeriteSchema = z.object({
  colaboradorId: z.string().uuid('ID do colaborador deve ser um UUID válido'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Competência deve estar no formato AAAA-MM'),
});

