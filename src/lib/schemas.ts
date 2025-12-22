import { z } from 'zod';

// Validadores base
export const cpfSchema = z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos');
export const cnpjSchema = z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos');
export const emailSchema = z.string().email('Email inválido');
export const telefoneSchema = z.string().regex(/^\d{10,11}$/, 'Telefone inválido');
export const cepSchema = z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos');

// Schema Colaborador
export const colaboradorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfSchema,
  email: emailSchema.optional(),
  telefone: telefoneSchema.optional(),
  data_nascimento: z.string().optional(),
  data_admissao: z.string(),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  departamento_id: z.string().uuid().optional(),
  salario: z.number().positive('Salário deve ser positivo'),
  status: z.enum(['ativo', 'inativo', 'ferias', 'afastado', 'desligado']).default('ativo'),
});

export type ColaboradorSchemaType = z.infer<typeof colaboradorSchema>;

// Schema Férias
export const feriasSchema = z.object({
  colaborador_id: z.string().uuid(),
  data_inicio: z.string(),
  data_fim: z.string(),
  dias_gozo: z.number().min(5).max(30),
  abono_pecuniario: z.boolean().default(false),
  dias_abono: z.number().min(0).max(10).optional(),
  observacoes: z.string().optional(),
});

export type FeriasSchemaType = z.infer<typeof feriasSchema>;

// Schema Empresa
export const empresaSchema = z.object({
  razao_social: z.string().min(3),
  cnpj: cnpjSchema,
  inscricao_estadual: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2).optional(),
  cep: cepSchema.optional(),
  telefone: telefoneSchema.optional(),
  email: emailSchema.optional(),
});

export type EmpresaSchemaType = z.infer<typeof empresaSchema>;

// Schema Ponto
export const pontoSchema = z.object({
  colaborador_id: z.string().uuid(),
  data: z.string(),
  entrada: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  saida_almoco: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  retorno_almoco: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  saida: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  observacoes: z.string().optional(),
});

export type PontoSchemaType = z.infer<typeof pontoSchema>;

// Schema Login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
