import { z } from "zod";

export const departamentoSchema = z.object({
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

export const departamentoSchemaCreate = departamentoSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const departamentoSchemaUpdate = departamentoSchema.partial().omit({ id: true, createdAt: true });
export const departamentoSchemaFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type departamentoType = z.infer<typeof departamentoSchema>;
export type departamentoCreateType = z.infer<typeof departamentoSchemaCreate>;
export type departamentoUpdateType = z.infer<typeof departamentoSchemaUpdate>;

export const validatedepartamento = (data: unknown) => departamentoSchema.safeParse(data);
export default departamentoSchema;
