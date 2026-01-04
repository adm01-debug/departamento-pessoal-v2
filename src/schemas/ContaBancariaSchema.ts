import { z } from "zod";

export const ContaBancariaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ContaBancariaCreateSchema = ContaBancariaSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const ContaBancariaUpdateSchema = ContaBancariaSchema.partial().required({ id: true });

export const ContaBancariaFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ContaBancaria = z.infer<typeof ContaBancariaSchema>;
export type ContaBancariaCreate = z.infer<typeof ContaBancariaCreateSchema>;
export type ContaBancariaUpdate = z.infer<typeof ContaBancariaUpdateSchema>;
export type ContaBancariaFilter = z.infer<typeof ContaBancariaFilterSchema>;

export function validateContaBancaria(data: unknown): ContaBancaria {
  return ContaBancariaSchema.parse(data);
}

export function validateContaBancariaCreate(data: unknown): ContaBancariaCreate {
  return ContaBancariaCreateSchema.parse(data);
}

export default { ContaBancariaSchema, ContaBancariaCreateSchema, ContaBancariaUpdateSchema, ContaBancariaFilterSchema };
