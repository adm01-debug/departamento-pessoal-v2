import { z } from "zod";

export const schemasRAIS = z.object({
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

export const schemasRAISCreate = schemasRAIS.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasRAISUpdate = schemasRAIS.partial().omit({ id: true, createdAt: true });

export type RAIS = z.infer<typeof schemasRAIS>;
export type RAISCreate = z.infer<typeof schemasRAISCreate>;
export type RAISUpdate = z.infer<typeof schemasRAISUpdate>;

export const validateRAIS = (data: unknown) => schemasRAIS.safeParse(data);
export default schemasRAIS;
