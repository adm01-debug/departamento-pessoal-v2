import { z } from 'zod';
export const contaBancariaSchema = z.object({ id: z.string(), banco: z.string(), agencia: z.string(), conta: z.string(), tipoConta: z.enum(['corrente', 'poupanca']), titular: z.string(), cpfTitular: z.string().length(11) });
export type ContaBancaria = z.infer<typeof contaBancariaSchema>;
