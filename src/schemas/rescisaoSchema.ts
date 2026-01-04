import { z } from "zod";

export const rescisaoSchema = z.object({
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

export const rescisaoSchemaCreate = rescisaoSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const rescisaoSchemaUpdate = rescisaoSchema.partial().omit({ id: true, createdAt: true });
export const rescisaoSchemaFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type rescisaoType = z.infer<typeof rescisaoSchema>;
export type rescisaoCreateType = z.infer<typeof rescisaoSchemaCreate>;
export type rescisaoUpdateType = z.infer<typeof rescisaoSchemaUpdate>;

export const validaterescisao = (data: unknown) => rescisaoSchema.safeParse(data);
export default rescisaoSchema;
