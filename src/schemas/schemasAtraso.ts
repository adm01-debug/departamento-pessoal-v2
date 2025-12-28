import { z } from 'zod';

export const schemasAtrasoCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasAtrasoUpdate = schemasAtrasoCreate.partial();

export const schemasAtrasoFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type AtrasoCreate = z.infer<typeof schemasAtrasoCreate>;
export type AtrasoUpdate = z.infer<typeof schemasAtrasoUpdate>;
export type AtrasoFilter = z.infer<typeof schemasAtrasoFilter>;

export const schemasAtraso = {
  create: schemasAtrasoCreate,
  update: schemasAtrasoUpdate,
  filter: schemasAtrasoFilter,
};

export default schemasAtraso;
