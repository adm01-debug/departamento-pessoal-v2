import { z } from "zod";

export const schemasFilial = z.object({
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

export const schemasFilialCreate = schemasFilial.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasFilialUpdate = schemasFilial.partial().omit({ id: true, createdAt: true });

export type Filial = z.infer<typeof schemasFilial>;
export type FilialCreate = z.infer<typeof schemasFilialCreate>;
export type FilialUpdate = z.infer<typeof schemasFilialUpdate>;

export const validateFilial = (data: unknown) => schemasFilial.safeParse(data);
export default schemasFilial;
