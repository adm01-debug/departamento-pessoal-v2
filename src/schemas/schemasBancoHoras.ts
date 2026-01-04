import { z } from "zod";

export const schemasBancoHoras = z.object({
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

export const schemasBancoHorasCreate = schemasBancoHoras.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasBancoHorasUpdate = schemasBancoHoras.partial().omit({ id: true, createdAt: true });

export type BancoHoras = z.infer<typeof schemasBancoHoras>;
export type BancoHorasCreate = z.infer<typeof schemasBancoHorasCreate>;
export type BancoHorasUpdate = z.infer<typeof schemasBancoHorasUpdate>;

export const validateBancoHoras = (data: unknown) => schemasBancoHoras.safeParse(data);
export default schemasBancoHoras;
