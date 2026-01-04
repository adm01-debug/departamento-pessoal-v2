import { z } from "zod";

export const RubricaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const RubricaCreateSchema = RubricaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const RubricaUpdateSchema = RubricaSchema.partial().required({ id: true });

export const RubricaFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Rubrica = z.infer<typeof RubricaSchema>;
export type RubricaCreate = z.infer<typeof RubricaCreateSchema>;
export type RubricaUpdate = z.infer<typeof RubricaUpdateSchema>;
export type RubricaFilter = z.infer<typeof RubricaFilterSchema>;

export function validateRubrica(data: unknown): Rubrica {
  return RubricaSchema.parse(data);
}

export function validateRubricaCreate(data: unknown): RubricaCreate {
  return RubricaCreateSchema.parse(data);
}

export default { RubricaSchema, RubricaCreateSchema, RubricaUpdateSchema, RubricaFilterSchema };
