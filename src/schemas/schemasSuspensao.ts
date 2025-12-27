import { z } from 'zod';
export const suspensaoSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataInicio: z.string(), dataFim: z.string(), dias: z.number(), motivo: z.string(), descricao: z.string() });
export type Suspensao = z.infer<typeof suspensaoSchema>;
