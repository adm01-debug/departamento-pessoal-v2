import { z } from 'zod';
export const rescisaoSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataDesligamento: z.string(), tipoRescisao: z.enum(['semJustaCausa', 'comJustaCausa', 'pedidoDemissao', 'acordoMutuo']), avisoPrevio: z.boolean(), saldoSalario: z.number(), ferias: z.number(), decimoTerceiro: z.number(), fgts: z.number(), multa: z.number() });
export type Rescisao = z.infer<typeof rescisaoSchema>;
