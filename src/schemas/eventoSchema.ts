import { z } from "zod";
export const eventoSchema = z.object({ id: z.string().uuid().optional(), colaboradorId: z.string().uuid(), folhaId: z.string().uuid(), rubricaId: z.string().uuid(), tipo: z.enum(["PROVENTO", "DESCONTO", "INFORMATIVO"]), quantidade: z.number().optional(), referencia: z.number().optional(), valor: z.number(), origem: z.enum(["MANUAL", "CALCULADO", "IMPORTADO", "AUTOMATICO"]).default("MANUAL"), observacao: z.string().optional() });
export type EventoInput = z.infer<typeof eventoSchema>;
export default eventoSchema;
