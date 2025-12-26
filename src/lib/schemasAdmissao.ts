import { z } from 'zod';

export const documentoAdmissaoSchema = z.object({
  tipo: z.string().min(1, 'Tipo obrigatório'),
  nome: z.string().min(1, 'Nome obrigatório'),
  url: z.string().url().optional(),
  status: z.enum(['pendente', 'enviado', 'aprovado', 'rejeitado']),
});

export const admissaoFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  telefone: z.string().optional(),
  cargo: z.string().min(1, 'Cargo obrigatório'),
  departamento: z.string().min(1, 'Departamento obrigatório'),
  dataAdmissao: z.string().min(1, 'Data de admissão obrigatória'),
  salario: z.number().positive('Salário deve ser positivo'),
  tipoContrato: z.enum(['clt', 'pj', 'estagio', 'temporario']),
});

export type AdmissaoFormData = z.infer<typeof admissaoFormSchema>;
