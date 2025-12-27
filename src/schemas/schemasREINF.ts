import { z } from 'zod';
export const reinfSchema = z.object({ id: z.string(), competencia: z.string(), empresaId: z.string(), evento: z.string(), status: z.enum(['pendente', 'enviado', 'aceito', 'rejeitado']), dataEnvio: z.string().optional(), recibo: z.string().optional() });
export type REINF = z.infer<typeof reinfSchema>;
