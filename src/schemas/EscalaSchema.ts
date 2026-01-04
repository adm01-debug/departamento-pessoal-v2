import { z } from "zod";

export const EscalaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const EscalaCreateSchema = EscalaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const EscalaUpdateSchema = EscalaSchema.partial().required({ id: true });

export const EscalaFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Escala = z.infer<typeof EscalaSchema>;
export type EscalaCreate = z.infer<typeof EscalaCreateSchema>;
export type EscalaUpdate = z.infer<typeof EscalaUpdateSchema>;
export type EscalaFilter = z.infer<typeof EscalaFilterSchema>;

export function validateEscala(data: unknown): Escala {
  return EscalaSchema.parse(data);
}

export function validateEscalaCreate(data: unknown): EscalaCreate {
  return EscalaCreateSchema.parse(data);
}

export default { EscalaSchema, EscalaCreateSchema, EscalaUpdateSchema, EscalaFilterSchema };
