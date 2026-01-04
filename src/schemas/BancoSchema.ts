import { z } from "zod";

export const BancoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const BancoCreateSchema = BancoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const BancoUpdateSchema = BancoSchema.partial().required({ id: true });

export const BancoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Banco = z.infer<typeof BancoSchema>;
export type BancoCreate = z.infer<typeof BancoCreateSchema>;
export type BancoUpdate = z.infer<typeof BancoUpdateSchema>;
export type BancoFilter = z.infer<typeof BancoFilterSchema>;

export function validateBanco(data: unknown): Banco {
  return BancoSchema.parse(data);
}

export function validateBancoCreate(data: unknown): BancoCreate {
  return BancoCreateSchema.parse(data);
}

export default { BancoSchema, BancoCreateSchema, BancoUpdateSchema, BancoFilterSchema };
