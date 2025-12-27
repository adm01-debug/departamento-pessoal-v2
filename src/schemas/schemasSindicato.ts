import { z } from 'zod';
export const sindicatoSchema = z.object({ id: z.string(), nome: z.string(), cnpj: z.string().length(14), telefone: z.string().optional(), email: z.string().email().optional(), contribuicaoMensal: z.number() });
export type Sindicato = z.infer<typeof sindicatoSchema>;
