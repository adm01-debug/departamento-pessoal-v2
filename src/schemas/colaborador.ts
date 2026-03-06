import { z } from 'zod';

export const colaboradorSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  cargoId: z.string().min(1, 'Cargo é obrigatório'),
  departamentoId: z.string().min(1, 'Departamento é obrigatório'),
  dataAdmissao: z.string().min(1, 'Data de admissão é obrigatória'),
  salario: z.number().min(0, 'Salário deve ser positivo'),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;
