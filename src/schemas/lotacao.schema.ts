// V17.2-Z012: Schema de Lotação
import { z } from 'zod';
export const lotacaoSchema = z.object({ empresa_id: z.string().uuid(), codigo: z.string().min(1).max(30), tipo: z.number().min(1).max(91), descricao: z.string().optional(), fpas: z.string().length(3), codigo_terceiros: z.string().length(4).optional(), rat: z.number().min(0).max(3), fap: z.number().min(0.5).max(2), cnae_preponderante: z.string().length(7).optional() });
export type LotacaoInput = z.infer<typeof lotacaoSchema>;
