import { z } from 'zod';

export const schemasTurnoCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasTurnoUpdate = schemasTurnoCreate.partial();

export const schemasTurnoFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type TurnoCreate = z.infer<typeof schemasTurnoCreate>;
export type TurnoUpdate = z.infer<typeof schemasTurnoUpdate>;
export type TurnoFilter = z.infer<typeof schemasTurnoFilter>;

export const schemasTurno = {
  create: schemasTurnoCreate,
  update: schemasTurnoUpdate,
  filter: schemasTurnoFilter,
};

export default schemasTurno;
