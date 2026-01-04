import { z } from "zod";

export const schemasAdvertencia = z.object({
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

export const schemasAdvertenciaCreate = schemasAdvertencia.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasAdvertenciaUpdate = schemasAdvertencia.partial().omit({ id: true, createdAt: true });

export type Advertencia = z.infer<typeof schemasAdvertencia>;
export type AdvertenciaCreate = z.infer<typeof schemasAdvertenciaCreate>;
export type AdvertenciaUpdate = z.infer<typeof schemasAdvertenciaUpdate>;

export const validateAdvertencia = (data: unknown) => schemasAdvertencia.safeParse(data);
export default schemasAdvertencia;
