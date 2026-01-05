import { z } from "zod";
export const dadosBancariosSchema = z.object({ id: z.string().uuid().optional(), colaboradorId: z.string().uuid(), banco: z.string().min(1).max(100), codigoBanco: z.string().length(3), agencia: z.string().min(1).max(10), digitoAgencia: z.string().max(2).optional(), conta: z.string().min(1).max(20), digitoConta: z.string().max(2).optional(), tipoConta: z.enum(["CORRENTE", "POUPANCA", "SALARIO"]), chavePix: z.string().optional(), tipoChavePix: z.enum(["CPF", "CNPJ", "EMAIL", "TELEFONE", "ALEATORIA"]).optional(), principal: z.boolean().default(true), ativo: z.boolean().default(true) });
export type DadosBancariosInput = z.infer<typeof dadosBancariosSchema>;
export default dadosBancariosSchema;
