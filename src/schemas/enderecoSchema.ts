import { z } from "zod";

export const enderecoSchema = z.object({
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

export const enderecoSchemaCreate = enderecoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const enderecoSchemaUpdate = enderecoSchema.partial().required({ id: true });
export const enderecoSchemaFilter = enderecoSchema.partial();

export type enderecoSchemaType = z.infer<typeof enderecoSchema>;
export type enderecoSchemaCreateType = z.infer<typeof enderecoSchemaCreate>;
export type enderecoSchemaUpdateType = z.infer<typeof enderecoSchemaUpdate>;
export type enderecoSchemaFilterType = z.infer<typeof enderecoSchemaFilter>;

export function validateenderecoSchema(data: unknown): enderecoSchemaType {
  return enderecoSchema.parse(data);
}

export function safeValidateenderecoSchema(data: unknown): { success: boolean; data?: enderecoSchemaType; error?: z.ZodError } {
  const result = enderecoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default enderecoSchema;
