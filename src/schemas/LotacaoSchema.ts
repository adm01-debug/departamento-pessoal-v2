import { z } from "zod";

export const LotacaoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const LotacaoCreateSchema = LotacaoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const LotacaoUpdateSchema = LotacaoSchema.partial().required({ id: true });

export const LotacaoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Lotacao = z.infer<typeof LotacaoSchema>;
export type LotacaoCreate = z.infer<typeof LotacaoCreateSchema>;
export type LotacaoUpdate = z.infer<typeof LotacaoUpdateSchema>;
export type LotacaoFilter = z.infer<typeof LotacaoFilterSchema>;

export function validateLotacao(data: unknown): Lotacao {
  return LotacaoSchema.parse(data);
}

export function validateLotacaoCreate(data: unknown): LotacaoCreate {
  return LotacaoCreateSchema.parse(data);
}

export default { LotacaoSchema, LotacaoCreateSchema, LotacaoUpdateSchema, LotacaoFilterSchema };
