import { z } from 'zod';
export const raisSchema = z.object({ id: z.string(), anoBase: z.number(), empresaId: z.string(), totalColaboradores: z.number(), status: z.enum(['pendente', 'enviado']), dataEnvio: z.string().optional(), protocolo: z.string().optional() });
export type RAIS = z.infer<typeof raisSchema>;
