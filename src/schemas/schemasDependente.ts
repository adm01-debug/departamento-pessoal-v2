import { z } from "zod";

export const schemasDependente = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome obrigatório").max(200),
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

export const schemasDependenteCreate = schemasDependente.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasDependenteUpdate = schemasDependente.partial().omit({ id: true, createdAt: true });
export const schemasDependenteFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type DependenteType = z.infer<typeof schemasDependente>;
export type DependenteCreateType = z.infer<typeof schemasDependenteCreate>;
export type DependenteUpdateType = z.infer<typeof schemasDependenteUpdate>;

export const validateDependente = (data: unknown) => schemasDependente.safeParse(data);
export default schemasDependente;
