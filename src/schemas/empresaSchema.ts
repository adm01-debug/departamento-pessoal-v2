import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const empresaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  cnpj: z.string().regex(cnpjRegex), razaoSocial: z.string(), nomeFantasia: z.string().optional(), endereco: z.string(), cidade: z.string(), uf: z.string().length(2), cep: z.string(), telefone: z.string().optional(), email: z.string().email().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type empresaSchemaType = z.infer<typeof empresaSchema>;
export const validateempresaSchema = (data: unknown) => empresaSchema.safeParse(data);
export default empresaSchema;
