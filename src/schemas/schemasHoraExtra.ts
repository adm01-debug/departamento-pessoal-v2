import { z } from 'zod';
export const horaExtraSchema = z.object({ id: z.string(), colaboradorId: z.string(), data: z.string(), horaInicio: z.string(), horaFim: z.string(), tipo: z.enum(['50', '100']), aprovado: z.boolean().default(false), justificativa: z.string().optional() });
export type HoraExtra = z.infer<typeof horaExtraSchema>;
