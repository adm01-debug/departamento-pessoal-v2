import { z } from 'zod';
export const atestadoSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataInicio: z.string(), dataFim: z.string(), cid: z.string().optional(), medico: z.string(), crm: z.string(), dias: z.number(), arquivo: z.string().optional() });
export type Atestado = z.infer<typeof atestadoSchema>;
