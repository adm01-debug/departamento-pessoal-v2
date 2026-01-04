import { z } from "zod";

export const schemasCentroCusto = z.object({
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

export const schemasCentroCustoCreate = schemasCentroCusto.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasCentroCustoUpdate = schemasCentroCusto.partial().omit({ id: true, createdAt: true });

export type CentroCusto = z.infer<typeof schemasCentroCusto>;
export type CentroCustoCreate = z.infer<typeof schemasCentroCustoCreate>;
export type CentroCustoUpdate = z.infer<typeof schemasCentroCustoUpdate>;

export const validateCentroCusto = (data: unknown) => schemasCentroCusto.safeParse(data);
export default schemasCentroCusto;
