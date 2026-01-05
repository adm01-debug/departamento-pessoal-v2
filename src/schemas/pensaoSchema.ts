import { z } from "zod";
export const pensaoSchema = z.object({ id: z.string().uuid().optional(), colaboradorId: z.string().uuid(), beneficiario: z.string().min(1).max(200), cpfBeneficiario: z.string().length(11).optional(), tipoCalculo: z.enum(["PERCENTUAL", "VALOR_FIXO"]), percentual: z.number().min(0).max(100).optional(), valorFixo: z.number().positive().optional(), baseCalculo: z.enum(["LIQUIDO", "BRUTO", "BRUTO_MENOS_INSS_IRRF"]).default("LIQUIDO"), banco: z.string().optional(), agencia: z.string().optional(), conta: z.string().optional(), numeroProcesso: z.string().optional(), vara: z.string().optional(), dataInicio: z.date(), dataFim: z.date().optional(), ativo: z.boolean().default(true) });
export type PensaoInput = z.infer<typeof pensaoSchema>;
export default pensaoSchema;
