import { z } from 'zod';

export const schemasEscalaCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasEscalaUpdate = schemasEscalaCreate.partial();

export const schemasEscalaFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type EscalaCreate = z.infer<typeof schemasEscalaCreate>;
export type EscalaUpdate = z.infer<typeof schemasEscalaUpdate>;
export type EscalaFilter = z.infer<typeof schemasEscalaFilter>;

export const schemasEscala = {
  create: schemasEscalaCreate,
  update: schemasEscalaUpdate,
  filter: schemasEscalaFilter,
};

export default schemasEscala;
