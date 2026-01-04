import { z } from "zod";

export const schemasGuiaINSS = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1).max(200),
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

export const schemasGuiaINSSCreate = schemasGuiaINSS.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasGuiaINSSUpdate = schemasGuiaINSS.partial();

export type GuiaINSSType = z.infer<typeof schemasGuiaINSS>;
export const validateGuiaINSS = (data: unknown) => schemasGuiaINSS.safeParse(data);
export default schemasGuiaINSS;
