import { z } from "zod";

export const schemasSuspensao = z.object({
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

export const schemasSuspensaoCreate = schemasSuspensao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasSuspensaoUpdate = schemasSuspensao.partial().omit({ id: true, createdAt: true });

export type Suspensao = z.infer<typeof schemasSuspensao>;
export type SuspensaoCreate = z.infer<typeof schemasSuspensaoCreate>;
export type SuspensaoUpdate = z.infer<typeof schemasSuspensaoUpdate>;

export const validateSuspensao = (data: unknown) => schemasSuspensao.safeParse(data);
export default schemasSuspensao;
