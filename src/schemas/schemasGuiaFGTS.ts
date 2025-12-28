import { z } from 'zod';

export const schemasGuiaFGTSCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasGuiaFGTSUpdate = schemasGuiaFGTSCreate.partial();

export const schemasGuiaFGTSFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type GuiaFGTSCreate = z.infer<typeof schemasGuiaFGTSCreate>;
export type GuiaFGTSUpdate = z.infer<typeof schemasGuiaFGTSUpdate>;
export type GuiaFGTSFilter = z.infer<typeof schemasGuiaFGTSFilter>;

export const schemasGuiaFGTS = {
  create: schemasGuiaFGTSCreate,
  update: schemasGuiaFGTSUpdate,
  filter: schemasGuiaFGTSFilter,
};

export default schemasGuiaFGTS;
