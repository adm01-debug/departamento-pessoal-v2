import { z } from "zod";

export const departamentoSchema = z.object({
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

export const departamentoSchemaCreate = departamentoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const departamentoSchemaUpdate = departamentoSchema.partial().required({ id: true });
export const departamentoSchemaFilter = departamentoSchema.partial();

export type departamentoSchemaType = z.infer<typeof departamentoSchema>;
export type departamentoSchemaCreateType = z.infer<typeof departamentoSchemaCreate>;
export type departamentoSchemaUpdateType = z.infer<typeof departamentoSchemaUpdate>;
export type departamentoSchemaFilterType = z.infer<typeof departamentoSchemaFilter>;

export function validatedepartamentoSchema(data: unknown): departamentoSchemaType {
  return departamentoSchema.parse(data);
}

export function safeValidatedepartamentoSchema(data: unknown): { success: boolean; data?: departamentoSchemaType; error?: z.ZodError } {
  const result = departamentoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default departamentoSchema;
