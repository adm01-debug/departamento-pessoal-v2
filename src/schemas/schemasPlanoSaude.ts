import { z } from 'zod';
export const planoSaudeSchema = z.object({ id: z.string(), colaboradorId: z.string(), operadora: z.string(), plano: z.string(), tipo: z.enum(['individual', 'familiar']), valorMensal: z.number(), participacaoEmpresa: z.number(), dependentes: z.array(z.object({ nome: z.string(), parentesco: z.string(), dataNascimento: z.string() })) });
export type PlanoSaude = z.infer<typeof planoSaudeSchema>;
