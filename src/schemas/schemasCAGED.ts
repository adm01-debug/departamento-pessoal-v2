import { z } from "zod";

export const schemasCAGED = z.object({
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

export const schemasCAGEDCreate = schemasCAGED.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasCAGEDUpdate = schemasCAGED.partial().omit({ id: true, createdAt: true });

export type CAGED = z.infer<typeof schemasCAGED>;
export type CAGEDCreate = z.infer<typeof schemasCAGEDCreate>;
export type CAGEDUpdate = z.infer<typeof schemasCAGEDUpdate>;

export const validateCAGED = (data: unknown) => schemasCAGED.safeParse(data);
export default schemasCAGED;
