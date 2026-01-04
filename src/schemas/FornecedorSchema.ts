import { z } from "zod";

export const FornecedorSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const FornecedorCreateSchema = FornecedorSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const FornecedorUpdateSchema = FornecedorSchema.partial().required({ id: true });

export const FornecedorFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Fornecedor = z.infer<typeof FornecedorSchema>;
export type FornecedorCreate = z.infer<typeof FornecedorCreateSchema>;
export type FornecedorUpdate = z.infer<typeof FornecedorUpdateSchema>;
export type FornecedorFilter = z.infer<typeof FornecedorFilterSchema>;

export function validateFornecedor(data: unknown): Fornecedor {
  return FornecedorSchema.parse(data);
}

export function validateFornecedorCreate(data: unknown): FornecedorCreate {
  return FornecedorCreateSchema.parse(data);
}

export default { FornecedorSchema, FornecedorCreateSchema, FornecedorUpdateSchema, FornecedorFilterSchema };
