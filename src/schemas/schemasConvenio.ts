import { z } from "zod";

export const schemasConvenio = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome é obrigatório").max(200),
  descricao: z.string().max(500).optional(),
  codigo: z.string().max(50).optional(),
  ativo: z.boolean().default(true),
  valor: z.number().positive().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  observacoes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const schemasConvenioCreate = schemasConvenio.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasConvenioUpdate = schemasConvenio.partial().omit({ id: true, createdAt: true });

export type Convenio = z.infer<typeof schemasConvenio>;
export type ConvenioCreate = z.infer<typeof schemasConvenioCreate>;
export type ConvenioUpdate = z.infer<typeof schemasConvenioUpdate>;

export const validateConvenio = (data: unknown) => schemasConvenio.safeParse(data);
export default schemasConvenio;
