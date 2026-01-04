import { z } from "zod";

export const schemasHoraExtra = z.object({
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

export const schemasHoraExtraCreate = schemasHoraExtra.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasHoraExtraUpdate = schemasHoraExtra.partial().omit({ id: true, createdAt: true });

export type HoraExtra = z.infer<typeof schemasHoraExtra>;
export type HoraExtraCreate = z.infer<typeof schemasHoraExtraCreate>;
export type HoraExtraUpdate = z.infer<typeof schemasHoraExtraUpdate>;

export const validateHoraExtra = (data: unknown) => schemasHoraExtra.safeParse(data);
export default schemasHoraExtra;
