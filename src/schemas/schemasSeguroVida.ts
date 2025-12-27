import { z } from 'zod';
export const seguroVidaSchema = z.object({ id: z.string(), colaboradorId: z.string(), seguradora: z.string(), apolice: z.string(), capitalSegurado: z.number(), valorMensal: z.number(), beneficiarios: z.array(z.object({ nome: z.string(), cpf: z.string(), percentual: z.number() })) });
export type SeguroVida = z.infer<typeof seguroVidaSchema>;
