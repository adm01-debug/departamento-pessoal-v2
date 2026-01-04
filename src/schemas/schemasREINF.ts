import { z } from "zod";

export const schemasREINF = z.object({
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

export const schemasREINFCreate = schemasREINF.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasREINFUpdate = schemasREINF.partial().omit({ id: true, createdAt: true });

export type REINF = z.infer<typeof schemasREINF>;
export type REINFCreate = z.infer<typeof schemasREINFCreate>;
export type REINFUpdate = z.infer<typeof schemasREINFUpdate>;

export const validateREINF = (data: unknown) => schemasREINF.safeParse(data);
export default schemasREINF;
