/**
 * @fileoverview Schema Zod para afastamentos
 * @module lib/schemasAfastamento
 */
import { z } from 'zod';

export const afastamentoSchema = z.object({
  colaborador_id: z.string().uuid('ID do colaborador inválido'),
  tipo: z.enum(['doenca', 'acidente_trabalho', 'maternidade', 'paternidade', 'licenca_nao_remunerada', 'servico_militar', 'outro'], {
    errorMap: () => ({ message: 'Tipo de afastamento inválido' }),
  }),
  motivo: z.string().min(10, 'Mínimo 10 caracteres').max(500),
  data_inicio: z.string().min(1, 'Data de início obrigatória'),
  data_fim: z.string().optional(),
  previsao_retorno: z.string().optional(),
  cid: z.string().regex(/^[A-Z]\d{2,3}$/, 'CID inválido').optional(),
  observacoes: z.string().max(1000).optional(),
}).refine(data => !data.data_fim || new Date(data.data_fim) >= new Date(data.data_inicio), {
  message: 'Data fim deve ser maior ou igual à data início',
  path: ['data_fim'],
});

export const encerrarAfastamentoSchema = z.object({
  afastamento_id: z.string().uuid(),
  data_retorno: z.string().min(1, 'Data de retorno obrigatória'),
  observacoes: z.string().optional(),
});

export type AfastamentoFormData = z.infer<typeof afastamentoSchema>;
export type EncerrarAfastamentoData = z.infer<typeof encerrarAfastamentoSchema>;
