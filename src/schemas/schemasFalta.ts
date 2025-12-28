import { z } from 'zod';

export const schemasFaltaCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasFaltaUpdate = schemasFaltaCreate.partial();

export const schemasFaltaFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type FaltaCreate = z.infer<typeof schemasFaltaCreate>;
export type FaltaUpdate = z.infer<typeof schemasFaltaUpdate>;
export type FaltaFilter = z.infer<typeof schemasFaltaFilter>;

export const schemasFalta = {
  create: schemasFaltaCreate,
  update: schemasFaltaUpdate,
  filter: schemasFaltaFilter,
};

export default schemasFalta;
