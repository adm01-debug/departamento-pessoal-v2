import { z } from 'zod';

export const enderecoSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
  estado: z.string().length(2, 'UF inválida'),
});

export const colaboradorFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  rg: z.string().optional(),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  telefone: z.string().optional(),
  celular: z.string().min(1, 'Celular obrigatório'),
  endereco: enderecoSchema,
  cargoId: z.string().uuid('Cargo inválido'),
  departamentoId: z.string().uuid('Departamento inválido'),
  dataAdmissao: z.string().min(1, 'Data de admissão obrigatória'),
  salario: z.number().positive('Salário deve ser positivo'),
});

export type ColaboradorFormData = z.infer<typeof colaboradorFormSchema>;
