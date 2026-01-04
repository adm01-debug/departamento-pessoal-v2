import { z } from "zod";

export const bancoSchema = z.object({
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

export const bancoSchemaCreate = bancoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const bancoSchemaUpdate = bancoSchema.partial().required({ id: true });
export const bancoSchemaFilter = bancoSchema.partial();

export type bancoSchemaType = z.infer<typeof bancoSchema>;
export type bancoSchemaCreateType = z.infer<typeof bancoSchemaCreate>;
export type bancoSchemaUpdateType = z.infer<typeof bancoSchemaUpdate>;
export type bancoSchemaFilterType = z.infer<typeof bancoSchemaFilter>;

export function validatebancoSchema(data: unknown): bancoSchemaType {
  return bancoSchema.parse(data);
}

export function safeValidatebancoSchema(data: unknown): { success: boolean; data?: bancoSchemaType; error?: z.ZodError } {
  const result = bancoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default bancoSchema;
