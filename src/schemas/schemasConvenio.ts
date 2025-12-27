import { z } from 'zod';
export const convenioSchema = z.object({ id: z.string(), nome: z.string(), tipo: z.enum(['saude', 'odonto', 'farmacia', 'alimentacao']), valorMensal: z.number(), desconto: z.number() });
export type Convenio = z.infer<typeof convenioSchema>;
