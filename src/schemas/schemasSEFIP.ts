import { z } from "zod";

export const schemasSEFIP = z.object({
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

export const schemasSEFIPCreate = schemasSEFIP.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasSEFIPUpdate = schemasSEFIP.partial().omit({ id: true, createdAt: true });

export type SEFIP = z.infer<typeof schemasSEFIP>;
export type SEFIPCreate = z.infer<typeof schemasSEFIPCreate>;
export type SEFIPUpdate = z.infer<typeof schemasSEFIPUpdate>;

export const validateSEFIP = (data: unknown) => schemasSEFIP.safeParse(data);
export default schemasSEFIP;
