import { z } from "zod";

export const pontoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome obrigatório").max(200),
  descricao: z.string().max(500).optional(),
  codigo: z.string().max(50).optional(),
  ativo: z.boolean().default(true),
  valor: z.number().nonnegative().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  observacoes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const pontoSchemaCreate = pontoSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const pontoSchemaUpdate = pontoSchema.partial().omit({ id: true, createdAt: true });
export const pontoSchemaFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type pontoType = z.infer<typeof pontoSchema>;
export type pontoCreateType = z.infer<typeof pontoSchemaCreate>;
export type pontoUpdateType = z.infer<typeof pontoSchemaUpdate>;

export const validateponto = (data: unknown) => pontoSchema.safeParse(data);
export default pontoSchema;
