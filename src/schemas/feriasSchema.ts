import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const feriasSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  colaboradorId: z.string().uuid(), dataInicio: z.string(), dataFim: z.string(), diasGozo: z.number().min(5).max(30), diasAbono: z.number().min(0).max(10), valor: z.number(), status: z.enum(["solicitada", "aprovada", "rejeitada", "em_gozo", "concluida"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type feriasSchemaType = z.infer<typeof feriasSchema>;
export const validateferiasSchema = (data: unknown) => feriasSchema.safeParse(data);
export default feriasSchema;
