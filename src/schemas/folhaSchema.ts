import { z } from "zod";

export const folhaSchema = z.object({
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

export const folhaSchemaCreate = folhaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const folhaSchemaUpdate = folhaSchema.partial().required({ id: true });
export const folhaSchemaFilter = folhaSchema.partial();

export type folhaSchemaType = z.infer<typeof folhaSchema>;
export type folhaSchemaCreateType = z.infer<typeof folhaSchemaCreate>;
export type folhaSchemaUpdateType = z.infer<typeof folhaSchemaUpdate>;
export type folhaSchemaFilterType = z.infer<typeof folhaSchemaFilter>;

export function validatefolhaSchema(data: unknown): folhaSchemaType {
  return folhaSchema.parse(data);
}

export function safeValidatefolhaSchema(data: unknown): { success: boolean; data?: folhaSchemaType; error?: z.ZodError } {
  const result = folhaSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default folhaSchema;
