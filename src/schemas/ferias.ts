// V15-283
import { z } from 'zod';
export const feriasSchema = z.object({
  colaborador_id: z.string().uuid(),
  data_inicio: z.date(),
  data_fim: z.date(),
  abono_pecuniario: z.boolean().default(false),
  dias_abono: z.number().min(0).max(10).optional(),
  adiantamento_13: z.boolean().default(false),
  observacoes: z.string().optional(),
}).refine(d => d.data_fim > d.data_inicio, { message: 'Data fim deve ser maior que início' });
export type FeriasSchema = z.infer<typeof feriasSchema>;
