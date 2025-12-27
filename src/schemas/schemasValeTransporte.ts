import { z } from 'zod';
export const valeTransporteSchema = z.object({ id: z.string(), colaboradorId: z.string(), linha: z.string(), tipo: z.enum(['onibus', 'metro', 'trem', 'barca']), valorUnitario: z.number(), quantidadeDiaria: z.number(), diasUteis: z.number().default(22) });
export type ValeTransporte = z.infer<typeof valeTransporteSchema>;
