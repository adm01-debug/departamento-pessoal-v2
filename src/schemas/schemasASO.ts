import { z } from "zod";

export const schemasASO = z.object({
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

export const schemasASOCreate = schemasASO.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasASOUpdate = schemasASO.partial();

export type ASOType = z.infer<typeof schemasASO>;
export const validateASO = (data: unknown) => schemasASO.safeParse(data);
export default schemasASO;
