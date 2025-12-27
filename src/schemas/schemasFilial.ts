import { z } from 'zod';
export const filialSchema = z.object({ id: z.string(), nome: z.string(), cnpj: z.string().length(14), endereco: z.string(), cidade: z.string(), uf: z.string().length(2), cep: z.string().length(8), empresaId: z.string() });
export type Filial = z.infer<typeof filialSchema>;
