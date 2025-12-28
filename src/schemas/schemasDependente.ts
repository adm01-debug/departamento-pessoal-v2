import { z } from 'zod';

export const schemasDependenteCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasDependenteUpdate = schemasDependenteCreate.partial();

export const schemasDependenteFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type DependenteCreate = z.infer<typeof schemasDependenteCreate>;
export type DependenteUpdate = z.infer<typeof schemasDependenteUpdate>;
export type DependenteFilter = z.infer<typeof schemasDependenteFilter>;

export const schemasDependente = {
  create: schemasDependenteCreate,
  update: schemasDependenteUpdate,
  filter: schemasDependenteFilter,
};

export default schemasDependente;
