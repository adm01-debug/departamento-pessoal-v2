import { z } from "zod";
export const treinamentoSchema = z.object({ id: z.string().uuid().optional(), nome: z.string().min(1).max(200), descricao: z.string().optional(), tipo: z.enum(["NR", "INTEGRACAO", "TECNICO", "COMPORTAMENTAL", "OBRIGATORIO", "DESENVOLVIMENTO"]), cargaHoraria: z.number().positive(), modalidade: z.enum(["PRESENCIAL", "ONLINE", "HIBRIDO"]), instrutor: z.string().optional(), fornecedor: z.string().optional(), validade: z.number().optional(), custo: z.number().optional(), ativo: z.boolean().default(true) });
export type TreinamentoInput = z.infer<typeof treinamentoSchema>;
export default treinamentoSchema;
