import { z } from 'zod';
export const permissaoSchema = z.object({ id: z.string(), nome: z.string(), descricao: z.string().optional(), ativo: z.boolean().default(true), modulo: z.string(), acoes: z.array(z.string()) });
export type Permissao = z.infer<typeof permissaoSchema>;
