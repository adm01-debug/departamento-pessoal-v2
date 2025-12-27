import { z } from 'zod';
export const dirfSchema = z.object({ id: z.string(), anoCalendario: z.number(), empresaId: z.string(), totalBeneficiarios: z.number(), totalRendimentos: z.number(), status: z.enum(['pendente', 'enviado']), dataEnvio: z.string().optional() });
export type DIRF = z.infer<typeof dirfSchema>;
