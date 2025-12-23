import { z } from 'zod';

export const beneficioSchema = z.object({
  colaborador_id: z.string().uuid('ID do colaborador inválido'),
  tipo: z.enum(['vt', 'vr', 'va', 'plano_saude', 'plano_odonto', 'seguro_vida', 'gym', 'outro'], {
    errorMap: () => ({ message: 'Tipo de benefício inválido' }),
  }),
  descricao: z.string().max(200).optional(),
  valor: z.number().min(0, 'Valor não pode ser negativo'),
  valor_empresa: z.number().min(0).optional(),
  valor_colaborador: z.number().min(0).optional(),
  data_inicio: z.string().min(1, 'Data de início obrigatória'),
  data_fim: z.string().optional(),
  observacoes: z.string().max(500).optional(),
});

export const suspenderBeneficioSchema = z.object({
  beneficio_id: z.string().uuid(),
  motivo: z.string().min(10, 'Mínimo 10 caracteres'),
  data_suspensao: z.string().min(1),
});

export type BeneficioFormData = z.infer<typeof beneficioSchema>;
export type SuspenderBeneficioData = z.infer<typeof suspenderBeneficioSchema>;
