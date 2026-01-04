import { z } from "zod";

export const contratoSchema = z.object({
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

export const contratoSchemaCreate = contratoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const contratoSchemaUpdate = contratoSchema.partial().required({ id: true });
export const contratoSchemaFilter = contratoSchema.partial();

export type contratoSchemaType = z.infer<typeof contratoSchema>;
export type contratoSchemaCreateType = z.infer<typeof contratoSchemaCreate>;
export type contratoSchemaUpdateType = z.infer<typeof contratoSchemaUpdate>;
export type contratoSchemaFilterType = z.infer<typeof contratoSchemaFilter>;

export function validatecontratoSchema(data: unknown): contratoSchemaType {
  return contratoSchema.parse(data);
}

export function safeValidatecontratoSchema(data: unknown): { success: boolean; data?: contratoSchemaType; error?: z.ZodError } {
  const result = contratoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default contratoSchema;
