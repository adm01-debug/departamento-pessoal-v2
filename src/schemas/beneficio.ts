import { z } from 'zod';

export const beneficioSchema = z.object({
  nome: z.string().min(2),
  tipo: z.enum(['vale_transporte', 'vale_refeicao', 'vale_alimentacao', 'plano_saude', 'plano_odontologico', 'seguro_vida', 'outros']),
  valor: z.number().min(0),
  fornecedor: z.string().optional(),
  ativo: z.boolean().default(true),
});

export type BeneficioSchema = z.infer<typeof beneficioSchema>;
export type BeneficioFormData = z.infer<typeof beneficioSchema>;
