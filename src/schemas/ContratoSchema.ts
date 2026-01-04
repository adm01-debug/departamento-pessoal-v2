import { z } from "zod";

export const ContratoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ContratoCreateSchema = ContratoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const ContratoUpdateSchema = ContratoSchema.partial().required({ id: true });

export const ContratoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Contrato = z.infer<typeof ContratoSchema>;
export type ContratoCreate = z.infer<typeof ContratoCreateSchema>;
export type ContratoUpdate = z.infer<typeof ContratoUpdateSchema>;
export type ContratoFilter = z.infer<typeof ContratoFilterSchema>;

export function validateContrato(data: unknown): Contrato {
  return ContratoSchema.parse(data);
}

export function validateContratoCreate(data: unknown): ContratoCreate {
  return ContratoCreateSchema.parse(data);
}

export default { ContratoSchema, ContratoCreateSchema, ContratoUpdateSchema, ContratoFilterSchema };
