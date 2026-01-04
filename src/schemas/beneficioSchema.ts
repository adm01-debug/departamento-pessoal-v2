import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const beneficioSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  tipo: z.enum(["vt", "va", "vr", "plano_saude", "odonto"]), valor: z.number(), descricao: z.string().optional(), ativo: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type beneficioSchemaType = z.infer<typeof beneficioSchema>;
export const validatebeneficioSchema = (data: unknown) => beneficioSchema.safeParse(data);
export default beneficioSchema;
