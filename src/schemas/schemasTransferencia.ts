import { z } from 'zod';
export const transferenciaSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataEfetivacao: z.string(), filialOrigem: z.string(), filialDestino: z.string(), departamentoOrigem: z.string().optional(), departamentoDestino: z.string().optional() });
export type Transferencia = z.infer<typeof transferenciaSchema>;
