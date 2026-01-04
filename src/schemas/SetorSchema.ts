import { z } from "zod";

export const SetorSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const SetorCreateSchema = SetorSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const SetorUpdateSchema = SetorSchema.partial().required({ id: true });

export const SetorFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Setor = z.infer<typeof SetorSchema>;
export type SetorCreate = z.infer<typeof SetorCreateSchema>;
export type SetorUpdate = z.infer<typeof SetorUpdateSchema>;
export type SetorFilter = z.infer<typeof SetorFilterSchema>;

export function validateSetor(data: unknown): Setor {
  return SetorSchema.parse(data);
}

export function validateSetorCreate(data: unknown): SetorCreate {
  return SetorCreateSchema.parse(data);
}

export default { SetorSchema, SetorCreateSchema, SetorUpdateSchema, SetorFilterSchema };
