import { z } from "zod";

export const admissaoSchema = z.object({
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

export const admissaoSchemaCreate = admissaoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const admissaoSchemaUpdate = admissaoSchema.partial().required({ id: true });
export const admissaoSchemaFilter = admissaoSchema.partial();

export type admissaoSchemaType = z.infer<typeof admissaoSchema>;
export type admissaoSchemaCreateType = z.infer<typeof admissaoSchemaCreate>;
export type admissaoSchemaUpdateType = z.infer<typeof admissaoSchemaUpdate>;
export type admissaoSchemaFilterType = z.infer<typeof admissaoSchemaFilter>;

export function validateadmissaoSchema(data: unknown): admissaoSchemaType {
  return admissaoSchema.parse(data);
}

export function safeValidateadmissaoSchema(data: unknown): { success: boolean; data?: admissaoSchemaType; error?: z.ZodError } {
  const result = admissaoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default admissaoSchema;
