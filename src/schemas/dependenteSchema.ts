import { z } from "zod";

export const dependenteSchema = z.object({
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

export const dependenteSchemaCreate = dependenteSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const dependenteSchemaUpdate = dependenteSchema.partial().required({ id: true });
export const dependenteSchemaFilter = dependenteSchema.partial();

export type dependenteSchemaType = z.infer<typeof dependenteSchema>;
export type dependenteSchemaCreateType = z.infer<typeof dependenteSchemaCreate>;
export type dependenteSchemaUpdateType = z.infer<typeof dependenteSchemaUpdate>;
export type dependenteSchemaFilterType = z.infer<typeof dependenteSchemaFilter>;

export function validatedependenteSchema(data: unknown): dependenteSchemaType {
  return dependenteSchema.parse(data);
}

export function safeValidatedependenteSchema(data: unknown): { success: boolean; data?: dependenteSchemaType; error?: z.ZodError } {
  const result = dependenteSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default dependenteSchema;
