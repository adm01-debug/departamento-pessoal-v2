import { z } from "zod";
export const lancamentoSchema = z.object({ colaboradorId: z.string().uuid(), competencia: z.string().regex(/^\d{2}\/\d{4}$/), rubricaId: z.string(), tipo: z.enum(["PROVENTO", "DESCONTO", "INFORMATIVO"]), referencia: z.number().optional(), valor: z.number(), observacao: z.string().optional() });
export type LancamentoInput = z.infer<typeof lancamentoSchema>;
export const validateLancamento = (data: unknown) => lancamentoSchema.safeParse(data);
