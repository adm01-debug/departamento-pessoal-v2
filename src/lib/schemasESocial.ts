/**
 * @fileoverview Schema Zod para eSocial
 * @module lib/schemasESocial
 */
import { z } from 'zod';

export const eventoESocialSchema = z.object({
  tipo: z.string().min(1, 'Tipo obrigatório'),
  empresa_id: z.string().uuid(),
  colaborador_id: z.string().uuid().optional(),
  dados: z.record(z.any()),
  observacoes: z.string().max(1000).optional(),
});

export const loteESocialSchema = z.object({
  empresa_id: z.string().uuid(),
  eventos: z.array(z.string().uuid()).min(1, 'Mínimo 1 evento'),
  ambiente: z.enum(['producao', 'producao_restrita']),
});

export const retificarEventoSchema = z.object({
  evento_id: z.string().uuid(),
  motivo: z.string().min(10, 'Mínimo 10 caracteres'),
  dados_corrigidos: z.record(z.any()),
});

export type EventoESocialFormData = z.infer<typeof eventoESocialSchema>;
export type LoteESocialData = z.infer<typeof loteESocialSchema>;
export type RetificarEventoData = z.infer<typeof retificarEventoSchema>;
