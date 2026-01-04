import { z } from "zod";

export const SindicatoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const SindicatoCreateSchema = SindicatoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const SindicatoUpdateSchema = SindicatoSchema.partial().required({ id: true });

export const SindicatoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Sindicato = z.infer<typeof SindicatoSchema>;
export type SindicatoCreate = z.infer<typeof SindicatoCreateSchema>;
export type SindicatoUpdate = z.infer<typeof SindicatoUpdateSchema>;
export type SindicatoFilter = z.infer<typeof SindicatoFilterSchema>;

export function validateSindicato(data: unknown): Sindicato {
  return SindicatoSchema.parse(data);
}

export function validateSindicatoCreate(data: unknown): SindicatoCreate {
  return SindicatoCreateSchema.parse(data);
}

export default { SindicatoSchema, SindicatoCreateSchema, SindicatoUpdateSchema, SindicatoFilterSchema };
