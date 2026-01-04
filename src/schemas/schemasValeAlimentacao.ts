import { z } from "zod";

export const schemasValeAlimentacao = z.object({
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

export const schemasValeAlimentacaoCreate = schemasValeAlimentacao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasValeAlimentacaoUpdate = schemasValeAlimentacao.partial().omit({ id: true, createdAt: true });

export type ValeAlimentacao = z.infer<typeof schemasValeAlimentacao>;
export type ValeAlimentacaoCreate = z.infer<typeof schemasValeAlimentacaoCreate>;
export type ValeAlimentacaoUpdate = z.infer<typeof schemasValeAlimentacaoUpdate>;

export const validateValeAlimentacao = (data: unknown) => schemasValeAlimentacao.safeParse(data);
export default schemasValeAlimentacao;
