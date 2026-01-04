import { z } from "zod";

export const schemasHomologacao = z.object({
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

export const schemasHomologacaoCreate = schemasHomologacao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasHomologacaoUpdate = schemasHomologacao.partial().omit({ id: true, createdAt: true });
export const schemasHomologacaoFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type HomologacaoType = z.infer<typeof schemasHomologacao>;
export type HomologacaoCreateType = z.infer<typeof schemasHomologacaoCreate>;
export type HomologacaoUpdateType = z.infer<typeof schemasHomologacaoUpdate>;

export const validateHomologacao = (data: unknown) => schemasHomologacao.safeParse(data);
export default schemasHomologacao;
