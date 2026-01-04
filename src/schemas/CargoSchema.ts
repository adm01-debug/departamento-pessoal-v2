import { z } from "zod";

export const CargoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CargoCreateSchema = CargoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const CargoUpdateSchema = CargoSchema.partial().required({ id: true });

export const CargoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Cargo = z.infer<typeof CargoSchema>;
export type CargoCreate = z.infer<typeof CargoCreateSchema>;
export type CargoUpdate = z.infer<typeof CargoUpdateSchema>;
export type CargoFilter = z.infer<typeof CargoFilterSchema>;

export function validateCargo(data: unknown): Cargo {
  return CargoSchema.parse(data);
}

export function validateCargoCreate(data: unknown): CargoCreate {
  return CargoCreateSchema.parse(data);
}

export default { CargoSchema, CargoCreateSchema, CargoUpdateSchema, CargoFilterSchema };
