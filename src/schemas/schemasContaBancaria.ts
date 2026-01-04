import { z } from "zod";

export const schemasContaBancaria = z.object({
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

export const schemasContaBancariaCreate = schemasContaBancaria.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasContaBancariaUpdate = schemasContaBancaria.partial().omit({ id: true, createdAt: true });

export type ContaBancaria = z.infer<typeof schemasContaBancaria>;
export type ContaBancariaCreate = z.infer<typeof schemasContaBancariaCreate>;
export type ContaBancariaUpdate = z.infer<typeof schemasContaBancariaUpdate>;

export const validateContaBancaria = (data: unknown) => schemasContaBancaria.safeParse(data);
export default schemasContaBancaria;
