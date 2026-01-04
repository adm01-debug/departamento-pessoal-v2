import { z } from "zod";

export const FeriadoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const FeriadoCreateSchema = FeriadoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const FeriadoUpdateSchema = FeriadoSchema.partial().required({ id: true });

export const FeriadoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Feriado = z.infer<typeof FeriadoSchema>;
export type FeriadoCreate = z.infer<typeof FeriadoCreateSchema>;
export type FeriadoUpdate = z.infer<typeof FeriadoUpdateSchema>;
export type FeriadoFilter = z.infer<typeof FeriadoFilterSchema>;

export function validateFeriado(data: unknown): Feriado {
  return FeriadoSchema.parse(data);
}

export function validateFeriadoCreate(data: unknown): FeriadoCreate {
  return FeriadoCreateSchema.parse(data);
}

export default { FeriadoSchema, FeriadoCreateSchema, FeriadoUpdateSchema, FeriadoFilterSchema };
