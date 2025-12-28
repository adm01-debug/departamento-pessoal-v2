import { z } from 'zod';

export const schemasJornadaCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasJornadaUpdate = schemasJornadaCreate.partial();

export const schemasJornadaFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type JornadaCreate = z.infer<typeof schemasJornadaCreate>;
export type JornadaUpdate = z.infer<typeof schemasJornadaUpdate>;
export type JornadaFilter = z.infer<typeof schemasJornadaFilter>;

export const schemasJornada = {
  create: schemasJornadaCreate,
  update: schemasJornadaUpdate,
  filter: schemasJornadaFilter,
};

export default schemasJornada;
