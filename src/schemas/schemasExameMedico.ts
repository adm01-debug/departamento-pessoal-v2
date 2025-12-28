import { z } from 'zod';

export const schemasExameMedicoCreate = z.object({
  empresaId: z.string().uuid(),
  colaboradorId: z.string().uuid().optional(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().min(0).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  observacoes: z.string().optional(),
});

export const schemasExameMedicoUpdate = schemasExameMedicoCreate.partial();

export const schemasExameMedicoFilter = z.object({
  empresaId: z.string().uuid().optional(),
  colaboradorId: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
});

export type ExameMedicoCreate = z.infer<typeof schemasExameMedicoCreate>;
export type ExameMedicoUpdate = z.infer<typeof schemasExameMedicoUpdate>;
export type ExameMedicoFilter = z.infer<typeof schemasExameMedicoFilter>;

export const schemasExameMedico = {
  create: schemasExameMedicoCreate,
  update: schemasExameMedicoUpdate,
  filter: schemasExameMedicoFilter,
};

export default schemasExameMedico;
