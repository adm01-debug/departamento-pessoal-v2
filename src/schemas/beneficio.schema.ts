// V17.2-Z009: Schema de Benefício
import { z } from 'zod';
export const beneficioSchema = z.object({ empresa_id: z.string().uuid(), nome: z.string().min(3), tipo: z.enum(['vale_transporte', 'vale_alimentacao', 'vale_refeicao', 'plano_saude', 'plano_odonto', 'seguro_vida', 'previdencia_privada', 'auxilio_creche', 'gym_pass', 'outros']), descricao: z.string().optional(), valor_empresa: z.number().min(0), valor_colaborador: z.number().min(0) });
export const atribuicaoBeneficioSchema = z.object({ colaborador_id: z.string().uuid(), beneficio_id: z.string().uuid(), valor_desconto: z.number().min(0).optional(), data_inicio: z.string() });
export type BeneficioInput = z.infer<typeof beneficioSchema>;
