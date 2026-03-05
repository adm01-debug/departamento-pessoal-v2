import { z } from 'zod';

export const feriasSchema = z.object({
  colaboradorId: z.string().min(1),
  dataInicio: z.string().min(1),
  dataFim: z.string().min(1),
  dias: z.number().min(1).max(30),
  abonoPecuniario: z.boolean().default(false),
  diasAbono: z.number().min(0).max(10).optional(),
  adiantamento_13: z.boolean().default(false),
  observacoes: z.string().optional(),
});

export type FeriasSchema = z.infer<typeof feriasSchema>;
export type FeriasFormData = z.infer<typeof feriasSchema>;
