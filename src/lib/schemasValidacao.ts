import { z } from 'zod';

// Schemas de validação reutilizáveis
export const cpfSchema = z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido');
export const cnpjSchema = z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido');
export const telefoneSchema = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido');
export const cepSchema = z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido');
export const emailSchema = z.string().email('E-mail inválido');
export const dataSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (AAAA-MM-DD)');

export const enderecoSchema = z.object({
  cep: cepSchema,
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
});

export const colaboradorFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema.optional(),
  data_nascimento: dataSchema.optional(),
  data_admissao: dataSchema,
  cargo_id: z.string().uuid('Cargo obrigatório'),
  departamento_id: z.string().uuid('Departamento obrigatório'),
  salario: z.number().positive('Salário deve ser positivo'),
});

export const feriasFormSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador obrigatório'),
  data_inicio: dataSchema,
  data_fim: dataSchema,
  dias_gozo: z.number().int().min(5).max(30),
  abono_pecuniario: z.boolean().optional(),
}).refine(data => new Date(data.data_fim) > new Date(data.data_inicio), {
  message: 'Data fim deve ser maior que data início',
  path: ['data_fim'],
});

export const pontoFormSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador obrigatório'),
  data: dataSchema,
  entrada: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida').optional(),
  saida: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida').optional(),
});

export type EnderecoForm = z.infer<typeof enderecoSchema>;
export type ColaboradorForm = z.infer<typeof colaboradorFormSchema>;
export type FeriasForm = z.infer<typeof feriasFormSchema>;
export type PontoForm = z.infer<typeof pontoFormSchema>;
