import { z } from 'zod';

export const schemasASOCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasASOUpdate = schemasASOCreate.partial();

export const schemasASOFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type ASOCreate = z.infer<typeof schemasASOCreate>;
export type ASOUpdate = z.infer<typeof schemasASOUpdate>;
export type ASOFilter = z.infer<typeof schemasASOFilter>;

export const schemasASO = {
  create: schemasASOCreate,
  update: schemasASOUpdate,
  filter: schemasASOFilter,
};

export default schemasASO;
