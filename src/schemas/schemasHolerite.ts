import { z } from 'zod';

export const schemasHoleriteCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasHoleriteUpdate = schemasHoleriteCreate.partial();

export const schemasHoleriteFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type HoleriteCreate = z.infer<typeof schemasHoleriteCreate>;
export type HoleriteUpdate = z.infer<typeof schemasHoleriteUpdate>;
export type HoleriteFilter = z.infer<typeof schemasHoleriteFilter>;

export const schemasHolerite = {
  create: schemasHoleriteCreate,
  update: schemasHoleriteUpdate,
  filter: schemasHoleriteFilter,
};

export default schemasHolerite;
