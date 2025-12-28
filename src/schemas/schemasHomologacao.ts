import { z } from 'zod';

export const schemasHomologacaoCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasHomologacaoUpdate = schemasHomologacaoCreate.partial();

export const schemasHomologacaoFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type HomologacaoCreate = z.infer<typeof schemasHomologacaoCreate>;
export type HomologacaoUpdate = z.infer<typeof schemasHomologacaoUpdate>;
export type HomologacaoFilter = z.infer<typeof schemasHomologacaoFilter>;

export const schemasHomologacao = {
  create: schemasHomologacaoCreate,
  update: schemasHomologacaoUpdate,
  filter: schemasHomologacaoFilter,
};

export default schemasHomologacao;
