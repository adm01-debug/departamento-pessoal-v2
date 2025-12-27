import { z } from 'zod';
export const valeAlimentacaoSchema = z.object({ id: z.string(), colaboradorId: z.string(), tipo: z.enum(['alimentacao', 'refeicao']), valor: z.number(), desconto: z.number().default(0), operadora: z.string().optional() });
export type ValeAlimentacao = z.infer<typeof valeAlimentacaoSchema>;
