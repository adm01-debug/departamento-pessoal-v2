import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const folhaPagamentoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  colaboradorId: z.string().uuid(), competencia: z.string(), salarioBruto: z.number(), descontos: z.number(), salarioLiquido: z.number(), status: z.enum(["rascunho", "calculada", "aprovada", "paga"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type folhaPagamentoSchemaType = z.infer<typeof folhaPagamentoSchema>;
export const validatefolhaPagamentoSchema = (data: unknown) => folhaPagamentoSchema.safeParse(data);
export default folhaPagamentoSchema;
