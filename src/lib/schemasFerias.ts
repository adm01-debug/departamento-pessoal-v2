/**
 * @fileoverview Schema Zod para férias
 * @module lib/schemasFerias
 */
import { z } from 'zod';

export const feriasSchema = z.object({
  colaborador_id: z.string().uuid('ID do colaborador inválido'),
  data_inicio: z.string().min(1, 'Data de início obrigatória'),
  data_fim: z.string().min(1, 'Data de fim obrigatória'),
  dias_gozo: z.number().min(5, 'Mínimo 5 dias').max(30, 'Máximo 30 dias'),
  dias_abono: z.number().min(0).max(10).optional(),
  abono_pecuniario: z.boolean().optional(),
  observacoes: z.string().max(500, 'Máximo 500 caracteres').optional(),
}).refine(data => new Date(data.data_fim) > new Date(data.data_inicio), {
  message: 'Data fim deve ser maior que data início',
  path: ['data_fim'],
});

export const aprovarFeriasSchema = z.object({
  ferias_id: z.string().uuid(),
  aprovador_id: z.string().uuid(),
  observacoes: z.string().optional(),
});

export const programarFeriasSchema = z.object({
  colaborador_id: z.string().uuid(),
  periodos: z.array(z.object({
    data_inicio: z.string(),
    data_fim: z.string(),
    dias: z.number().min(5).max(30),
  })).min(1, 'Pelo menos um período obrigatório'),
});

export type FeriasFormData = z.infer<typeof feriasSchema>;
export type AprovarFeriasData = z.infer<typeof aprovarFeriasSchema>;
export type ProgramarFeriasData = z.infer<typeof programarFeriasSchema>;
