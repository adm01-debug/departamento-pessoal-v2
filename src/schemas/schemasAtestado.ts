import { z } from "zod";

export const schemasAtestado = z.object({
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

export const schemasAtestadoCreate = schemasAtestado.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasAtestadoUpdate = schemasAtestado.partial().omit({ id: true, createdAt: true });

export type Atestado = z.infer<typeof schemasAtestado>;
export type AtestadoCreate = z.infer<typeof schemasAtestadoCreate>;
export type AtestadoUpdate = z.infer<typeof schemasAtestadoUpdate>;

export const validateAtestado = (data: unknown) => schemasAtestado.safeParse(data);
export default schemasAtestado;
