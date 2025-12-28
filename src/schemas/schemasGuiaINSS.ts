import { z } from 'zod';

export const schemasGuiaINSSCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasGuiaINSSUpdate = schemasGuiaINSSCreate.partial();

export const schemasGuiaINSSFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type GuiaINSSCreate = z.infer<typeof schemasGuiaINSSCreate>;
export type GuiaINSSUpdate = z.infer<typeof schemasGuiaINSSUpdate>;
export type GuiaINSSFilter = z.infer<typeof schemasGuiaINSSFilter>;

export const schemasGuiaINSS = {
  create: schemasGuiaINSSCreate,
  update: schemasGuiaINSSUpdate,
  filter: schemasGuiaINSSFilter,
};

export default schemasGuiaINSS;
