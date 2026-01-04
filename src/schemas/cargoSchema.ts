import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const cargoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  titulo: z.string(), cbo: z.string().optional(), nivel: z.string().optional(), salarioBase: z.number().optional(), descricao: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type cargoSchemaType = z.infer<typeof cargoSchema>;
export const validatecargoSchema = (data: unknown) => cargoSchema.safeParse(data);
export default cargoSchema;
