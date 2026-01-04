import { z } from "zod";

export const contatoSchema = z.object({
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

export const contatoSchemaCreate = contatoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });
export const contatoSchemaUpdate = contatoSchema.partial().required({ id: true });
export const contatoSchemaFilter = contatoSchema.partial();

export type contatoSchemaType = z.infer<typeof contatoSchema>;
export type contatoSchemaCreateType = z.infer<typeof contatoSchemaCreate>;
export type contatoSchemaUpdateType = z.infer<typeof contatoSchemaUpdate>;
export type contatoSchemaFilterType = z.infer<typeof contatoSchemaFilter>;

export function validatecontatoSchema(data: unknown): contatoSchemaType {
  return contatoSchema.parse(data);
}

export function safeValidatecontatoSchema(data: unknown): { success: boolean; data?: contatoSchemaType; error?: z.ZodError } {
  const result = contatoSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

export default contatoSchema;
