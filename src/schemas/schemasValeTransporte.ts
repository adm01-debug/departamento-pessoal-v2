import { z } from "zod";

export const schemasValeTransporte = z.object({
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

export const schemasValeTransporteCreate = schemasValeTransporte.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasValeTransporteUpdate = schemasValeTransporte.partial().omit({ id: true, createdAt: true });

export type ValeTransporte = z.infer<typeof schemasValeTransporte>;
export type ValeTransporteCreate = z.infer<typeof schemasValeTransporteCreate>;
export type ValeTransporteUpdate = z.infer<typeof schemasValeTransporteUpdate>;

export const validateValeTransporte = (data: unknown) => schemasValeTransporte.safeParse(data);
export default schemasValeTransporte;
