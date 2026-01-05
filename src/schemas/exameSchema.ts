import { z } from "zod";
export const exameSchema = z.object({ id: z.string().uuid().optional(), colaboradorId: z.string().uuid(), tipo: z.enum(["ADMISSIONAL", "PERIODICO", "RETORNO_TRABALHO", "MUDANCA_FUNCAO", "DEMISSIONAL"]), dataExame: z.date(), dataValidade: z.date(), resultado: z.enum(["APTO", "INAPTO", "APTO_COM_RESTRICAO"]).optional(), medico: z.string().min(1), crm: z.string().min(1), riscos: z.array(z.string()).optional(), observacoes: z.string().optional(), documentoId: z.string().uuid().optional() });
export type ExameInput = z.infer<typeof exameSchema>;
export default exameSchema;
