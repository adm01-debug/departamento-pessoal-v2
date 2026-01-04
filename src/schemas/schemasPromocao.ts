import { z } from "zod";

export const schemasPromocao = z.object({
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

export const schemasPromocaoCreate = schemasPromocao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasPromocaoUpdate = schemasPromocao.partial().omit({ id: true, createdAt: true });

export type Promocao = z.infer<typeof schemasPromocao>;
export type PromocaoCreate = z.infer<typeof schemasPromocaoCreate>;
export type PromocaoUpdate = z.infer<typeof schemasPromocaoUpdate>;

export const validatePromocao = (data: unknown) => schemasPromocao.safeParse(data);
export default schemasPromocao;
