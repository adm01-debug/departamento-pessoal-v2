import { z } from "zod";

export const DependenteSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const DependenteCreateSchema = DependenteSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const DependenteUpdateSchema = DependenteSchema.partial().required({ id: true });

export const DependenteFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Dependente = z.infer<typeof DependenteSchema>;
export type DependenteCreate = z.infer<typeof DependenteCreateSchema>;
export type DependenteUpdate = z.infer<typeof DependenteUpdateSchema>;
export type DependenteFilter = z.infer<typeof DependenteFilterSchema>;

export function validateDependente(data: unknown): Dependente {
  return DependenteSchema.parse(data);
}

export function validateDependenteCreate(data: unknown): DependenteCreate {
  return DependenteCreateSchema.parse(data);
}

export default { DependenteSchema, DependenteCreateSchema, DependenteUpdateSchema, DependenteFilterSchema };
