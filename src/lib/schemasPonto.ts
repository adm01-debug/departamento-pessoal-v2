import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const registroPontoSchema = z.object({
  colaborador_id: z.string().uuid('ID do colaborador inválido'),
  data: z.string().min(1, 'Data obrigatória'),
  entrada: z.string().regex(timeRegex, 'Formato inválido (HH:MM)').optional(),
  saida_almoco: z.string().regex(timeRegex, 'Formato inválido').optional(),
  retorno_almoco: z.string().regex(timeRegex, 'Formato inválido').optional(),
  saida: z.string().regex(timeRegex, 'Formato inválido').optional(),
  observacoes: z.string().max(500).optional(),
  justificativa: z.string().max(500).optional(),
});

export const ajustePontoSchema = z.object({
  registro_id: z.string().uuid(),
  campo: z.enum(['entrada', 'saida_almoco', 'retorno_almoco', 'saida']),
  valor_anterior: z.string().optional(),
  valor_novo: z.string().regex(timeRegex, 'Formato inválido'),
  motivo: z.string().min(10, 'Mínimo 10 caracteres'),
});

export const fechamentoPontoSchema = z.object({
  empresa_id: z.string().uuid(),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2020).max(2100),
});

export type RegistroPontoFormData = z.infer<typeof registroPontoSchema>;
export type AjustePontoData = z.infer<typeof ajustePontoSchema>;
export type FechamentoPontoData = z.infer<typeof fechamentoPontoSchema>;
