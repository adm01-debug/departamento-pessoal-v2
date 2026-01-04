import { z } from "zod";

export const schemasPermissao = z.object({
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

export const schemasPermissaoCreate = schemasPermissao.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasPermissaoUpdate = schemasPermissao.partial().omit({ id: true, createdAt: true });

export type Permissao = z.infer<typeof schemasPermissao>;
export type PermissaoCreate = z.infer<typeof schemasPermissaoCreate>;
export type PermissaoUpdate = z.infer<typeof schemasPermissaoUpdate>;

export const validatePermissao = (data: unknown) => schemasPermissao.safeParse(data);
export default schemasPermissao;
