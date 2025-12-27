import { z } from 'zod';
export const centroCustoSchema = z.object({ id: z.string(), codigo: z.string(), nome: z.string(), ativo: z.boolean().default(true), empresaId: z.string() });
export type CentroCusto = z.infer<typeof centroCustoSchema>;
