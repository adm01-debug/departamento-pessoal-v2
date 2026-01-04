import { z } from "zod";

export const schemasTransferencia = z.object({
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

export const schemasTransferenciaCreate = schemasTransferencia.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasTransferenciaUpdate = schemasTransferencia.partial().omit({ id: true, createdAt: true });

export type Transferencia = z.infer<typeof schemasTransferencia>;
export type TransferenciaCreate = z.infer<typeof schemasTransferenciaCreate>;
export type TransferenciaUpdate = z.infer<typeof schemasTransferenciaUpdate>;

export const validateTransferencia = (data: unknown) => schemasTransferencia.safeParse(data);
export default schemasTransferencia;
