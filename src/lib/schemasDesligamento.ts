/**
 * @fileoverview Schema Zod para desligamentos
 * @module lib/schemasDesligamento
 */
import { z } from 'zod';

export const desligamentoSchema = z.object({
  colaborador_id: z.string().uuid('ID do colaborador inválido'),
  data_desligamento: z.string().min(1, 'Data de desligamento obrigatória'),
  tipo: z.enum(['demissao_sem_justa_causa', 'demissao_justa_causa', 'pedido_demissao', 'acordo', 'aposentadoria', 'falecimento', 'outro'], {
    errorMap: () => ({ message: 'Tipo de desligamento inválido' }),
  }),
  motivo: z.string().min(10, 'Mínimo 10 caracteres').max(1000),
  aviso_previo: z.enum(['trabalhado', 'indenizado', 'dispensado']).optional(),
  data_aviso: z.string().optional(),
  observacoes: z.string().max(2000).optional(),
});

export const calcularRescisaoSchema = z.object({
  colaborador_id: z.string().uuid(),
  data_desligamento: z.string(),
  tipo: z.string(),
  aviso_previo: z.string(),
  saldo_ferias: z.number(),
  decimo_terceiro_proporcional: z.boolean(),
});

export type DesligamentoFormData = z.infer<typeof desligamentoSchema>;
export type CalcularRescisaoData = z.infer<typeof calcularRescisaoSchema>;
