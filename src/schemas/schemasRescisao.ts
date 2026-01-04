import { z } from "zod";

export const schemasRescisao = z.object({
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

export const schemasRescisaoCreate = schemasRescisao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasRescisaoUpdate = schemasRescisao.partial().omit({ id: true, createdAt: true });
export const schemasRescisaoFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type RescisaoType = z.infer<typeof schemasRescisao>;
export type RescisaoCreateType = z.infer<typeof schemasRescisaoCreate>;
export type RescisaoUpdateType = z.infer<typeof schemasRescisaoUpdate>;

export const validateRescisao = (data: unknown) => schemasRescisao.safeParse(data);
export default schemasRescisao;
