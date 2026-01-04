import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const colaboradorSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  cpf: z.string().regex(cpfRegex), email: z.string().email().optional(), telefone: z.string().regex(telefoneRegex).optional(), dataAdmissao: z.string(), cargo: z.string(), departamento: z.string(), salario: z.number().positive(), status: z.enum(["ativo", "inativo", "ferias", "afastado"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type colaboradorSchemaType = z.infer<typeof colaboradorSchema>;
export const validatecolaboradorSchema = (data: unknown) => colaboradorSchema.safeParse(data);
export default colaboradorSchema;
