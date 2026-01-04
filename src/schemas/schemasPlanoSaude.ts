import { z } from "zod";

export const schemasPlanoSaude = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome obrigatório").max(200),
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

export const schemasPlanoSaudeCreate = schemasPlanoSaude.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasPlanoSaudeUpdate = schemasPlanoSaude.partial().omit({ id: true, createdAt: true });
export const schemasPlanoSaudeFilter = z.object({ search: z.string().optional(), ativo: z.boolean().optional(), page: z.number().optional(), limit: z.number().optional() });

export type PlanoSaudeType = z.infer<typeof schemasPlanoSaude>;
export type PlanoSaudeCreateType = z.infer<typeof schemasPlanoSaudeCreate>;
export type PlanoSaudeUpdateType = z.infer<typeof schemasPlanoSaudeUpdate>;

export const validatePlanoSaude = (data: unknown) => schemasPlanoSaude.safeParse(data);
export default schemasPlanoSaude;
