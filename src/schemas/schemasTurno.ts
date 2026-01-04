import { z } from "zod";

export const schemasTurno = z.object({
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

export const schemasTurnoCreate = schemasTurno.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasTurnoUpdate = schemasTurno.partial();

export type TurnoType = z.infer<typeof schemasTurno>;
export const validateTurno = (data: unknown) => schemasTurno.safeParse(data);
export default schemasTurno;
