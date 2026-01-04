import { z } from "zod";

export const BeneficioSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const BeneficioCreateSchema = BeneficioSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const BeneficioUpdateSchema = BeneficioSchema.partial().required({ id: true });

export const BeneficioFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Beneficio = z.infer<typeof BeneficioSchema>;
export type BeneficioCreate = z.infer<typeof BeneficioCreateSchema>;
export type BeneficioUpdate = z.infer<typeof BeneficioUpdateSchema>;
export type BeneficioFilter = z.infer<typeof BeneficioFilterSchema>;

export function validateBeneficio(data: unknown): Beneficio {
  return BeneficioSchema.parse(data);
}

export function validateBeneficioCreate(data: unknown): BeneficioCreate {
  return BeneficioCreateSchema.parse(data);
}

export default { BeneficioSchema, BeneficioCreateSchema, BeneficioUpdateSchema, BeneficioFilterSchema };
