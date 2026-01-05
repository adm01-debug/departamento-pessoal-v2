import { z } from "zod";
export const afastamentoSchema = z.object({ id: z.string().uuid().optional(), colaboradorId: z.string().uuid(), tipo: z.enum(["DOENCA", "ACIDENTE_TRABALHO", "MATERNIDADE", "PATERNIDADE", "SERVICO_MILITAR", "MANDATO_SINDICAL", "OUTROS"]), dataInicio: z.date(), dataFim: z.date().optional(), dias: z.number().int().positive(), cid: z.string().max(10).optional(), crm: z.string().max(20).optional(), inss: z.boolean().default(false), documentoId: z.string().uuid().optional(), observacao: z.string().optional() });
export type AfastamentoInput = z.infer<typeof afastamentoSchema>;
export default afastamentoSchema;
