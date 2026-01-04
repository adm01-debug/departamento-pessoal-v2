import { z } from "zod";

export const schemasSeguroVida = z.object({
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

export const schemasSeguroVidaCreate = schemasSeguroVida.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasSeguroVidaUpdate = schemasSeguroVida.partial().omit({ id: true, createdAt: true });

export type SeguroVida = z.infer<typeof schemasSeguroVida>;
export type SeguroVidaCreate = z.infer<typeof schemasSeguroVidaCreate>;
export type SeguroVidaUpdate = z.infer<typeof schemasSeguroVidaUpdate>;

export const validateSeguroVida = (data: unknown) => schemasSeguroVida.safeParse(data);
export default schemasSeguroVida;
