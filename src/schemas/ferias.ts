import { z } from 'zod';

export const feriasSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador obrigatório'),
  data_inicio: z.string().min(1, 'Data de início obrigatória'),
  data_fim: z.string().min(1, 'Data de fim obrigatória'),
  dias_ferias: z.number().min(5).max(30, 'Máximo de 30 dias'),
  dias_abono: z.number().min(0).max(10).default(0),
  observacoes: z.string().optional(),
  empresa_id: z.string().uuid().optional(),
});

export type FeriasSchema = z.infer<typeof feriasSchema>;
