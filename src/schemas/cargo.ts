import { z } from 'zod';

export const cargoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cbo: z.string().min(1, 'CBO é obrigatório'),
  nivel: z.string().min(1, 'Nível é obrigatório'),
  departamentoId: z.string().min(1, 'Departamento é obrigatório'),
  salarioBase: z.number().min(0, 'Salário deve ser positivo'),
  descricao: z.string().optional(),
  ativo: z.boolean().optional().default(true),
});

export type CargoFormData = z.infer<typeof cargoSchema>;
