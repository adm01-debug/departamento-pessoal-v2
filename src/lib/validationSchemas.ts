/**
 * @fileoverview Schemas de validação de formulários
 * @module lib/validationSchemas
 */
import { z } from 'zod';

// ============================================
// VALIDADORES CUSTOMIZADOS
// ============================================

const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)+$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpfLimpo[10]);
};

const validarPIS = (pis: string): boolean => {
  const pisLimpo = pis.replace(/\D/g, '');
  if (pisLimpo.length !== 11) return false;
  const mult = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(pisLimpo[i]) * mult[i];
  const resto = soma % 11;
  const digito = resto < 2 ? 0 : 11 - resto;
  return digito === parseInt(pisLimpo[10]);
};

// ============================================
// SCHEMAS BASE
// ============================================

export const cpfSchema = z.string().min(11, 'CPF deve ter 11 dígitos').refine(validarCPF, 'CPF inválido');
export const pisSchema = z.string().min(11, 'PIS deve ter 11 dígitos').refine(validarPIS, 'PIS inválido');
export const emailSchema = z.string().email('Email inválido').optional().or(z.literal(''));
export const telefoneSchema = z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido').optional().or(z.literal(''));
export const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional().or(z.literal(''));
export const dataSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').refine(val => !isNaN(Date.parse(val)), 'Data inválida');
export const dataOpcionalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional().or(z.literal(''));
export const valorMonetarioSchema = z.number().min(0, 'Valor não pode ser negativo').max(999999999, 'Valor muito alto');

// ============================================
// SCHEMA: COLABORADOR
// ============================================

export const colaboradorSchema = z.object({
  nome_completo: z.string().min(5, 'Nome deve ter pelo menos 5 caracteres').max(100, 'Nome muito longo'),
  cpf: cpfSchema,
  rg: z.string().optional().or(z.literal('')),
  data_nascimento: dataSchema,
  sexo: z.enum(['M', 'F', 'O'], { errorMap: () => ({ message: 'Selecione o sexo' }) }),
  estado_civil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']).optional(),
  pis: pisSchema,
  ctps_numero: z.string().optional().or(z.literal('')),
  ctps_serie: z.string().optional().or(z.literal('')),
  email: emailSchema,
  telefone: telefoneSchema,
  cep: cepSchema,
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().length(2, 'Use sigla').optional().or(z.literal('')),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  departamento: z.string().min(2, 'Departamento obrigatório'),
  data_admissao: dataSchema,
  salario_base: valorMonetarioSchema.min(1412, 'Salário não pode ser menor que o mínimo'),
  tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario', 'jovem_aprendiz']).default('clt'),
  jornada_semanal: z.number().min(1).max(44).default(44),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  dependentes_ir: z.number().min(0).max(20).default(0),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

// ============================================
// SCHEMA: FÉRIAS
// ============================================

export const feriasSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  data_inicio: dataSchema,
  dias_gozo: z.number().min(5, 'Mínimo 5 dias').max(30, 'Máximo 30 dias'),
  dias_abono: z.number().min(0).max(10).default(0),
  observacoes: z.string().max(500).optional(),
}).refine(data => data.dias_abono <= Math.floor(data.dias_gozo / 3), { 
  message: 'Abono não pode exceder 1/3 dos dias', path: ['dias_abono'] 
});

export type FeriasFormData = z.infer<typeof feriasSchema>;

// ============================================
// SCHEMA: AFASTAMENTO
// ============================================

export const afastamentoSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  tipo: z.enum(['atestado_medico', 'licenca_maternidade', 'licenca_paternidade', 'acidente_trabalho', 'auxilio_doenca', 'licenca_casamento', 'licenca_obito', 'outros']),
  data_inicio: dataSchema,
  data_fim: dataOpcionalSchema,
  cid: z.string().regex(/^[A-Z]\d{2}(\.\d)?$/, 'CID inválido').optional().or(z.literal('')),
  dias: z.number().min(1).max(365),
  observacoes: z.string().max(500).optional(),
});

export type AfastamentoFormData = z.infer<typeof afastamentoSchema>;

// ============================================
// SCHEMA: DESLIGAMENTO
// ============================================

export const desligamentoSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  tipo: z.enum(['dispensa_sem_justa_causa', 'dispensa_com_justa_causa', 'pedido_demissao', 'acordo_mutuo', 'aposentadoria', 'falecimento', 'termino_contrato']),
  data_desligamento: dataSchema,
  aviso_previo: z.enum(['trabalhado', 'indenizado', 'dispensado']).default('indenizado'),
  motivo: z.string().min(10, 'Descreva o motivo').max(500),
  observacoes: z.string().max(1000).optional(),
});

export type DesligamentoFormData = z.infer<typeof desligamentoSchema>;

// ============================================
// SCHEMA: PONTO
// ============================================

export const registroPontoSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  data: dataSchema,
  entrada_1: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional().or(z.literal('')),
  saida_1: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional().or(z.literal('')),
  entrada_2: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional().or(z.literal('')),
  saida_2: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional().or(z.literal('')),
  tipo_dia: z.enum(['normal', 'feriado', 'compensado', 'folga', 'falta', 'atestado', 'ferias', 'licenca']).default('normal'),
  observacoes: z.string().max(500).optional(),
});

export type RegistroPontoFormData = z.infer<typeof registroPontoSchema>;

// ============================================
// SCHEMA: BENEFÍCIO
// ============================================

export const beneficioSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  tipo: z.enum(['vale_transporte', 'vale_refeicao', 'vale_alimentacao', 'plano_saude', 'plano_odontologico', 'seguro_vida', 'auxilio_creche', 'outros']),
  valor: valorMonetarioSchema,
  desconto_folha: valorMonetarioSchema.default(0),
  data_inicio: dataSchema,
  data_fim: dataOpcionalSchema,
  observacoes: z.string().max(500).optional(),
});

export type BeneficioFormData = z.infer<typeof beneficioSchema>;

// ============================================
// SCHEMA: LANÇAMENTO FOLHA
// ============================================

export const lancamentoFolhaSchema = z.object({
  colaborador_id: z.string().uuid('Selecione um colaborador'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato AAAA-MM'),
  rubrica_id: z.string().uuid('Selecione uma rubrica'),
  tipo: z.enum(['provento', 'desconto']),
  valor: valorMonetarioSchema.min(0.01, 'Valor obrigatório'),
  observacoes: z.string().max(500).optional(),
});

export type LancamentoFolhaFormData = z.infer<typeof lancamentoFolhaSchema>;

// ============================================
// UTILITÁRIOS
// ============================================

export const formatZodErrors = (errors: z.ZodError): Record<string, string> => {
  const formatted: Record<string, string> = {};
  errors.errors.forEach(err => { formatted[err.path.join('.')] = err.message; });
  return formatted;
};

export const validateCPF = (cpf: string): boolean => validarCPF(cpf.replace(/\D/g, ''));
export const validatePIS = (pis: string): boolean => validarPIS(pis.replace(/\D/g, ''));

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: formatZodErrors(result.error) };
};

// ============================================
// SCHEMA: BENEFÍCIO
// ============================================
export const beneficioSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().min(0, 'Valor deve ser positivo').optional(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional(),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional().nullable(),
  ativo: z.boolean().default(true),
});

export const atribuicaoBeneficioSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador inválido'),
  beneficio_id: z.string().uuid('Benefício inválido'),
  valor_customizado: z.number().min(0).optional().nullable(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional().nullable(),
});

// ============================================
// SCHEMA: AFASTAMENTO
// ============================================
export const afastamentoSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador é obrigatório'),
  tipo: z.enum([
    'doenca',
    'acidente_trabalho',
    'licenca_maternidade',
    'licenca_paternidade',
    'licenca_casamento',
    'licenca_obito',
    'auxilio_doenca',
    'outros'
  ], { errorMap: () => ({ message: 'Tipo de afastamento inválido' }) }),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início inválida'),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de fim inválida').optional().nullable(),
  cid: z.string().max(10, 'CID muito longo').optional().nullable(),
  num_atestado: z.string().optional().nullable(),
  observacao: z.string().max(1000, 'Observação muito longa').optional().nullable(),
  dias_afastamento: z.number().int().min(1, 'Mínimo 1 dia').optional(),
});

// ============================================
// SCHEMA: PONTO
// ============================================
export const registroPontoSchema = z.object({
  colaborador_id: z.string().uuid('Colaborador é obrigatório'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  entrada_1: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Horário inválido').optional().nullable(),
  saida_1: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Horário inválido').optional().nullable(),
  entrada_2: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Horário inválido').optional().nullable(),
  saida_2: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Horário inválido').optional().nullable(),
  observacao: z.string().max(500).optional().nullable(),
});

// ============================================
// TIPOS INFERIDOS
// ============================================
export type BeneficioInput = z.infer<typeof beneficioSchema>;
export type AtribuicaoBeneficioInput = z.infer<typeof atribuicaoBeneficioSchema>;
export type AfastamentoInput = z.infer<typeof afastamentoSchema>;
export type RegistroPontoInput = z.infer<typeof registroPontoSchema>;
