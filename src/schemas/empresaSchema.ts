import { z } from "zod";

export const empresaSchema = z.object({
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

export const empresaSchemaCreate = empresaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const empresaSchemaUpdate = empresaSchema.partial().required({ id: true });
export const empresaSchemaFilter = empresaSchema.partial();

export type empresaSchemaType = z.infer<typeof empresaSchema>;
export type empresaSchemaCreateType = z.infer<typeof empresaSchemaCreate>;
export type empresaSchemaUpdateType = z.infer<typeof empresaSchemaUpdate>;
export type empresaSchemaFilterType = z.infer<typeof empresaSchemaFilter>;

export function validateempresaSchema(data: unknown): empresaSchemaType {
  return empresaSchema.parse(data);
}

export function safeValidateempresaSchema(data: unknown): { success: boolean; data?: empresaSchemaType; error?: z.ZodError } {
  const result = empresaSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default empresaSchema;
