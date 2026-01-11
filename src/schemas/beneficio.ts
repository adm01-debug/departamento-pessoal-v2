// V15-284
import { z } from 'zod';
export const beneficioSchema = z.object({
  nome: z.string().min(2),
  tipo: z.enum(['vale_transporte', 'vale_refeicao', 'vale_alimentacao', 'plano_saude', 'plano_odontologico', 'seguro_vida', 'outros']),
  valor_empresa: z.number().min(0),
  valor_colaborador: z.number().min(0),
  tipo_desconto: z.enum(['percentual', 'fixo', 'sem_desconto']),
  fornecedor: z.string().optional(),
  ativo: z.boolean().default(true),
});
export type BeneficioSchema = z.infer<typeof beneficioSchema>;
