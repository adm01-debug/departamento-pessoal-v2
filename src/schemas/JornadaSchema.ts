import { z } from "zod";

export const JornadaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const JornadaCreateSchema = JornadaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const JornadaUpdateSchema = JornadaSchema.partial().required({ id: true });

export const JornadaFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Jornada = z.infer<typeof JornadaSchema>;
export type JornadaCreate = z.infer<typeof JornadaCreateSchema>;
export type JornadaUpdate = z.infer<typeof JornadaUpdateSchema>;
export type JornadaFilter = z.infer<typeof JornadaFilterSchema>;

export function validateJornada(data: unknown): Jornada {
  return JornadaSchema.parse(data);
}

export function validateJornadaCreate(data: unknown): JornadaCreate {
  return JornadaCreateSchema.parse(data);
}

export default { JornadaSchema, JornadaCreateSchema, JornadaUpdateSchema, JornadaFilterSchema };
