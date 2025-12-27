import { z } from 'zod';
export const advertenciaSchema = z.object({ id: z.string(), colaboradorId: z.string(), data: z.string(), motivo: z.string(), descricao: z.string(), tipo: z.enum(['verbal', 'escrita']), assinada: z.boolean().default(false) });
export type Advertencia = z.infer<typeof advertenciaSchema>;
