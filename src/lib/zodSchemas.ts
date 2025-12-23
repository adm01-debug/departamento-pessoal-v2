import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const colaboradorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  data_admissao: z.string().min(1, 'Data de admissão é obrigatória'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  departamento_id: z.string().uuid('Departamento é obrigatório'),
  salario: z.number().positive('Salário deve ser positivo'),
});

export const feriasSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador é obrigatório'),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
  dias_gozo: z.number().min(5).max(30, 'Dias de gozo entre 5 e 30'),
  abono_pecuniario: z.boolean().optional(),
}).refine(data => new Date(data.data_fim) > new Date(data.data_inicio), { message: 'Data fim deve ser após data início', path: ['data_fim'] });

export const empresaSchema = z.object({
  razao_social: z.string().min(3, 'Razão social muito curta'),
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  inscricao_estadual: z.string().optional(),
  endereco: z.string().min(5, 'Endereço muito curto'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
});

export const pontoSchema = z.object({
  colaborador_id: z.string().uuid(),
  data: z.string().min(1),
  entrada: z.string().optional(),
  saida_almoco: z.string().optional(),
  retorno_almoco: z.string().optional(),
  saida: z.string().optional(),
});

export const afastamentoSchema = z.object({
  colaborador_id: z.string().uuid(),
  tipo: z.enum(['doenca', 'acidente_trabalho', 'maternidade', 'paternidade', 'licenca_nao_remunerada', 'servico_militar', 'outro']),
  motivo: z.string().min(3, 'Motivo muito curto'),
  data_inicio: z.string().min(1),
  data_fim: z.string().optional(),
  cid: z.string().optional(),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;
export type FeriasFormData = z.infer<typeof feriasSchema>;
export type EmpresaFormData = z.infer<typeof empresaSchema>;
export type PontoFormData = z.infer<typeof pontoSchema>;
export type AfastamentoFormData = z.infer<typeof afastamentoSchema>;
