import { z } from 'zod';
export const cagedSchema = z.object({ id: z.string(), competencia: z.string(), empresaId: z.string(), admissoes: z.number(), desligamentos: z.number(), status: z.enum(['pendente', 'enviado']), dataEnvio: z.string().optional() });
export type CAGED = z.infer<typeof cagedSchema>;
