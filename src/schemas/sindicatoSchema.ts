import { z } from "zod";
export const sindicatoSchema = z.object({ id: z.string().uuid().optional(), codigo: z.string().min(1).max(20), nome: z.string().min(1).max(200), cnpj: z.string().length(14).optional(), endereco: z.string().optional(), cidade: z.string().optional(), uf: z.string().length(2).optional(), telefone: z.string().optional(), email: z.string().email().optional(), contribuicaoSindical: z.number().min(0).max(100).optional(), contribuicaoAssistencial: z.number().min(0).max(100).optional(), mesBase: z.number().min(1).max(12).optional(), dataBaseSalarial: z.string().optional(), ativo: z.boolean().default(true) });
export type SindicatoInput = z.infer<typeof sindicatoSchema>;
export default sindicatoSchema;
