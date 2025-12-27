import { z } from 'zod';
export const bancoHorasSchema = z.object({ id: z.string(), colaboradorId: z.string(), saldo: z.number(), ultimaAtualizacao: z.string(), historico: z.array(z.object({ data: z.string(), horas: z.number(), tipo: z.enum(['credito', 'debito']) })) });
export type BancoHoras = z.infer<typeof bancoHorasSchema>;
