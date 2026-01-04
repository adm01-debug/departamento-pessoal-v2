import { z } from "zod";

export const feriasSchema = z.object({
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

export const feriasSchemaCreate = feriasSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const feriasSchemaUpdate = feriasSchema.partial().required({ id: true });
export const feriasSchemaFilter = feriasSchema.partial();

export type feriasSchemaType = z.infer<typeof feriasSchema>;
export type feriasSchemaCreateType = z.infer<typeof feriasSchemaCreate>;
export type feriasSchemaUpdateType = z.infer<typeof feriasSchemaUpdate>;
export type feriasSchemaFilterType = z.infer<typeof feriasSchemaFilter>;

export function validateferiasSchema(data: unknown): feriasSchemaType {
  return feriasSchema.parse(data);
}

export function safeValidateferiasSchema(data: unknown): { success: boolean; data?: feriasSchemaType; error?: z.ZodError } {
  const result = feriasSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default feriasSchema;
