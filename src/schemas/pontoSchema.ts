import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const pontoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  colaboradorId: z.string().uuid(), data: z.string(), entrada1: z.string().optional(), saida1: z.string().optional(), entrada2: z.string().optional(), saida2: z.string().optional(), horasTrabalhadas: z.number().optional(), status: z.enum(["pendente", "aprovado", "ajustado"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type pontoSchemaType = z.infer<typeof pontoSchema>;
export const validatepontoSchema = (data: unknown) => pontoSchema.safeParse(data);
export default pontoSchema;
