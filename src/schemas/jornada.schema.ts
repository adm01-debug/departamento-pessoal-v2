// V17.2-Z011: Schema de Jornada
import { z } from 'zod';
export const jornadaSchema = z.object({ empresa_id: z.string().uuid(), nome: z.string().min(3), tipo: z.enum(['padrao', 'escala_6x1', 'escala_5x2', 'escala_12x36', 'parcial', 'especial']), carga_horaria_semanal: z.number().min(1).max(44), entrada: z.string().regex(/^\d{2}:\d{2}$/), saida: z.string().regex(/^\d{2}:\d{2}$/), intervalo_inicio: z.string().optional(), intervalo_fim: z.string().optional(), tolerancia_entrada: z.number().min(0).max(30).default(10), tolerancia_saida: z.number().min(0).max(30).default(10), dias_trabalho: z.array(z.number().min(0).max(6)) });
export type JornadaInput = z.infer<typeof jornadaSchema>;
