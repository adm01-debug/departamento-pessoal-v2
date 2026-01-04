import { z } from "zod";

export const beneficioSchema = z.object({
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

export const beneficioSchemaCreate = beneficioSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const beneficioSchemaUpdate = beneficioSchema.partial().required({ id: true });
export const beneficioSchemaFilter = beneficioSchema.partial();

export type beneficioSchemaType = z.infer<typeof beneficioSchema>;
export type beneficioSchemaCreateType = z.infer<typeof beneficioSchemaCreate>;
export type beneficioSchemaUpdateType = z.infer<typeof beneficioSchemaUpdate>;
export type beneficioSchemaFilterType = z.infer<typeof beneficioSchemaFilter>;

export function validatebeneficioSchema(data: unknown): beneficioSchemaType {
  return beneficioSchema.parse(data);
}

export function safeValidatebeneficioSchema(data: unknown): { success: boolean; data?: beneficioSchemaType; error?: z.ZodError } {
  const result = beneficioSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default beneficioSchema;
