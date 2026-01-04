import { z } from "zod";

export const cargoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome obrigatório").max(100),
  descricao: z.string().optional(),
  codigo: z.string().optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  criadoPor: z.string().optional(),
  atualizadoPor: z.string().optional(),
});

export const cargoSchemaCreate = cargoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const cargoSchemaUpdate = cargoSchema.partial().required({ id: true });
export const cargoSchemaFilter = cargoSchema.partial();

export type cargoSchemaType = z.infer<typeof cargoSchema>;
export type cargoSchemaCreateType = z.infer<typeof cargoSchemaCreate>;
export type cargoSchemaUpdateType = z.infer<typeof cargoSchemaUpdate>;
export type cargoSchemaFilterType = z.infer<typeof cargoSchemaFilter>;

export function validatecargoSchema(data: unknown): cargoSchemaType {
  return cargoSchema.parse(data);
}

export function safeValidatecargoSchema(data: unknown): { success: boolean; data?: cargoSchemaType; error?: z.ZodError } {
  const result = cargoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default cargoSchema;
