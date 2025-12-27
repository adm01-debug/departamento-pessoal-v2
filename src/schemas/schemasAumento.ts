import { z } from 'zod';
export const aumentoSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataEfetivacao: z.string(), salarioAnterior: z.number(), salarioNovo: z.number(), percentual: z.number(), motivo: z.enum(['merito', 'dissidio', 'promocao', 'ajuste']) });
export type Aumento = z.infer<typeof aumentoSchema>;
