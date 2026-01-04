import { z } from "zod";

export const documentoSchema = z.object({
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

export const documentoSchemaCreate = documentoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const documentoSchemaUpdate = documentoSchema.partial().required({ id: true });
export const documentoSchemaFilter = documentoSchema.partial();

export type documentoSchemaType = z.infer<typeof documentoSchema>;
export type documentoSchemaCreateType = z.infer<typeof documentoSchemaCreate>;
export type documentoSchemaUpdateType = z.infer<typeof documentoSchemaUpdate>;
export type documentoSchemaFilterType = z.infer<typeof documentoSchemaFilter>;

export function validatedocumentoSchema(data: unknown): documentoSchemaType {
  return documentoSchema.parse(data);
}

export function safeValidatedocumentoSchema(data: unknown): { success: boolean; data?: documentoSchemaType; error?: z.ZodError } {
  const result = documentoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default documentoSchema;
