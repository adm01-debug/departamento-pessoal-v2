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
