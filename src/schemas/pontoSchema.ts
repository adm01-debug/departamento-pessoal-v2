import { z } from "zod";

export const pontoSchema = z.object({
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

export const pontoSchemaCreate = pontoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const pontoSchemaUpdate = pontoSchema.partial().required({ id: true });
export const pontoSchemaFilter = pontoSchema.partial();

export type pontoSchemaType = z.infer<typeof pontoSchema>;
export type pontoSchemaCreateType = z.infer<typeof pontoSchemaCreate>;
export type pontoSchemaUpdateType = z.infer<typeof pontoSchemaUpdate>;
export type pontoSchemaFilterType = z.infer<typeof pontoSchemaFilter>;

export function validatepontoSchema(data: unknown): pontoSchemaType {
  return pontoSchema.parse(data);
}

export function safeValidatepontoSchema(data: unknown): { success: boolean; data?: pontoSchemaType; error?: z.ZodError } {
  const result = pontoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default pontoSchema;
