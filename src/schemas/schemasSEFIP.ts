import { z } from 'zod';
export const sefipSchema = z.object({ id: z.string(), competencia: z.string(), empresaId: z.string(), tipoRecolhimento: z.number(), baseCalculo: z.number(), valorRecolher: z.number(), arquivo: z.string().optional() });
export type SEFIP = z.infer<typeof sefipSchema>;
