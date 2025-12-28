import { z } from 'zod';

export const schemasDARFCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasDARFUpdate = schemasDARFCreate.partial();

export const schemasDARFFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type DARFCreate = z.infer<typeof schemasDARFCreate>;
export type DARFUpdate = z.infer<typeof schemasDARFUpdate>;
export type DARFFilter = z.infer<typeof schemasDARFFilter>;

export const schemasDARF = {
  create: schemasDARFCreate,
  update: schemasDARFUpdate,
  filter: schemasDARFFilter,
};

export default schemasDARF;
