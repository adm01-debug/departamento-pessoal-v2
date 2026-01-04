import { z } from "zod";

export const schemasExameMedico = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome obrigatório").max(200),
  descricao: z.string().max(500).optional(),
  codigo: z.string().max(50).optional(),
  ativo: z.boolean().default(true),
  valor: z.number().nonnegative().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  observacoes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const schemasExameMedicoCreate = schemasExameMedico.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasExameMedicoUpdate = schemasExameMedico.partial().omit({ id: true, createdAt: true });
export const schemasExameMedicoFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type ExameMedicoType = z.infer<typeof schemasExameMedico>;
export type ExameMedicoCreateType = z.infer<typeof schemasExameMedicoCreate>;
export type ExameMedicoUpdateType = z.infer<typeof schemasExameMedicoUpdate>;

export const validateExameMedico = (data: unknown) => schemasExameMedico.safeParse(data);
export default schemasExameMedico;
