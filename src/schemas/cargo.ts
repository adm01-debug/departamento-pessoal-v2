import { z } from 'zod';

export const cargoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cbo: z.string().regex(/^\d{4}-\d{2}$/, 'CBO inválido (formato: 0000-00)'),
  nivel: z.enum(['junior', 'pleno', 'senior', 'especialista', 'gerente', 'diretor']).optional(),
  descricao: z.string().optional(),
  departamentoId: z.string().min(1, 'Departamento obrigatório'),
  salarioBase: z.number().min(1, 'Salário base deve ser maior que zero'),
  salarioTeto: z.number().optional(),
  beneficios: z.array(z.string()).optional(),
  requisitos: z.array(z.string()).optional(),
  ativo: z.boolean(),
}).refine(data => {
  if (data.salarioTeto && data.salarioTeto < data.salarioBase) return false;
  return true;
}, { message: 'Salário teto deve ser maior que o base', path: ['salarioTeto'] });

export type CargoFormData = z.infer<typeof cargoSchema>;
