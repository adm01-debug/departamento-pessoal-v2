import { z } from 'zod';

export const schemasEPICreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasEPIUpdate = schemasEPICreate.partial();

export const schemasEPIFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type EPICreate = z.infer<typeof schemasEPICreate>;
export type EPIUpdate = z.infer<typeof schemasEPIUpdate>;
export type EPIFilter = z.infer<typeof schemasEPIFilter>;

export const schemasEPI = {
  create: schemasEPICreate,
  update: schemasEPIUpdate,
  filter: schemasEPIFilter,
};

export default schemasEPI;
