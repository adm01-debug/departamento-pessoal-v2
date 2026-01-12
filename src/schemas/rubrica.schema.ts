// V17.2-Z010: Schema de Rubrica
import { z } from 'zod';
export const rubricaSchema = z.object({ empresa_id: z.string().uuid(), codigo: z.string().min(1).max(30), nome: z.string().min(3).max(100), tipo: z.enum(['1', '2', '3', '4']).transform(Number), incidencia_inss: z.boolean().default(false), incidencia_irrf: z.boolean().default(false), incidencia_fgts: z.boolean().default(false), codigo_incidencia_inss: z.string().optional(), codigo_incidencia_irrf: z.string().optional(), codigo_incidencia_fgts: z.string().optional() });
export type RubricaInput = z.infer<typeof rubricaSchema>;
