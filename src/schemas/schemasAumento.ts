import { z } from "zod";

export const schemasAumento = z.object({
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

export const schemasAumentoCreate = schemasAumento.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasAumentoUpdate = schemasAumento.partial().omit({ id: true, createdAt: true });

export type Aumento = z.infer<typeof schemasAumento>;
export type AumentoCreate = z.infer<typeof schemasAumentoCreate>;
export type AumentoUpdate = z.infer<typeof schemasAumentoUpdate>;

export const validateAumento = (data: unknown) => schemasAumento.safeParse(data);
export default schemasAumento;
