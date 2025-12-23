import { z } from 'zod';

export const departamentoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  descricao: z.string().max(500).optional(),
  gestor_id: z.string().uuid().optional(),
  empresa_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  ativo: z.boolean().default(true),
});

export const cargoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  descricao: z.string().max(500).optional(),
  departamento_id: z.string().uuid().optional(),
  cbo: z.string().regex(/^\d{4}-?\d{2}$/, 'CBO inválido').optional(),
  salario_base: z.number().min(0).optional(),
  salario_minimo: z.number().min(0).optional(),
  salario_maximo: z.number().min(0).optional(),
  nivel: z.enum(['junior', 'pleno', 'senior', 'especialista', 'gerente', 'diretor']).optional(),
  ativo: z.boolean().default(true),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;
export type CargoFormData = z.infer<typeof cargoSchema>;
