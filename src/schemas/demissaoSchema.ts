import { z } from "zod";

export const demissaoSchema = z.object({
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

export const demissaoSchemaCreate = demissaoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const demissaoSchemaUpdate = demissaoSchema.partial().required({ id: true });
export const demissaoSchemaFilter = demissaoSchema.partial();

export type demissaoSchemaType = z.infer<typeof demissaoSchema>;
export type demissaoSchemaCreateType = z.infer<typeof demissaoSchemaCreate>;
export type demissaoSchemaUpdateType = z.infer<typeof demissaoSchemaUpdate>;
export type demissaoSchemaFilterType = z.infer<typeof demissaoSchemaFilter>;

export function validatedemissaoSchema(data: unknown): demissaoSchemaType {
  return demissaoSchema.parse(data);
}

export function safeValidatedemissaoSchema(data: unknown): { success: boolean; data?: demissaoSchemaType; error?: z.ZodError } {
  const result = demissaoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default demissaoSchema;
