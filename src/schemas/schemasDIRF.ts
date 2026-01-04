import { z } from "zod";

export const schemasDIRF = z.object({
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

export const schemasDIRFCreate = schemasDIRF.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasDIRFUpdate = schemasDIRF.partial().omit({ id: true, createdAt: true });

export type DIRF = z.infer<typeof schemasDIRF>;
export type DIRFCreate = z.infer<typeof schemasDIRFCreate>;
export type DIRFUpdate = z.infer<typeof schemasDIRFUpdate>;

export const validateDIRF = (data: unknown) => schemasDIRF.safeParse(data);
export default schemasDIRF;
