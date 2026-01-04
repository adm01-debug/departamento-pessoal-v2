import { z } from "zod";

export const schemasSindicato = z.object({
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

export const schemasSindicatoCreate = schemasSindicato.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasSindicatoUpdate = schemasSindicato.partial().omit({ id: true, createdAt: true });

export type Sindicato = z.infer<typeof schemasSindicato>;
export type SindicatoCreate = z.infer<typeof schemasSindicatoCreate>;
export type SindicatoUpdate = z.infer<typeof schemasSindicatoUpdate>;

export const validateSindicato = (data: unknown) => schemasSindicato.safeParse(data);
export default schemasSindicato;
