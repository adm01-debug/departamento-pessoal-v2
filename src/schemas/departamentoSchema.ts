import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const departamentoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  codigo: z.string(), gestorId: z.string().uuid().optional(), orcamento: z.number().optional(), ativo: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type departamentoSchemaType = z.infer<typeof departamentoSchema>;
export const validatedepartamentoSchema = (data: unknown) => departamentoSchema.safeParse(data);
export default departamentoSchema;
