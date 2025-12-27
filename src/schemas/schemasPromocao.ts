import { z } from 'zod';
export const promocaoSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataEfetivacao: z.string(), cargoAnterior: z.string(), cargoNovo: z.string(), salarioAnterior: z.number(), salarioNovo: z.number(), motivo: z.string().optional() });
export type Promocao = z.infer<typeof promocaoSchema>;
