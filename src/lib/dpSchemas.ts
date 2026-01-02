import { z } from 'zod';

// Schema para importação de Colaboradores
export const colaboradorImportSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  email: z.string().email('E-mail inválido').optional(),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  data_admissao: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  salario: z.coerce.number().positive('Salário deve ser positivo').optional(),
  tipo_contrato: z.enum(['CLT', 'PJ', 'Estagiário', 'Temporário']).optional(),
});

// Schema para importação de Férias
export const feriasImportSchema = z.object({
  colaborador_cpf: z.string().min(1, 'CPF do colaborador é obrigatório'),
  data_inicio: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_fim: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  dias: z.coerce.number().int().positive().max(30),
  abono_pecuniario: z.coerce.boolean().optional(),
  observacoes: z.string().optional(),
});

// Schema para importação de Afastamentos
export const afastamentoImportSchema = z.object({
  colaborador_cpf: z.string().min(1, 'CPF do colaborador é obrigatório'),
  tipo: z.enum(['Atestado', 'Licença Maternidade', 'Licença Paternidade', 'Acidente de Trabalho', 'Outros']),
  data_inicio: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_fim: z.string().optional(),
  cid: z.string().optional(),
  motivo: z.string().optional(),
});

// Schema para importação de Benefícios
export const beneficioImportSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum(['Vale Transporte', 'Vale Refeição', 'Vale Alimentação', 'Plano de Saúde', 'Plano Odontológico', 'Outros']),
  valor: z.coerce.number().positive().optional(),
  descricao: z.string().optional(),
});

// Schema para importação de Cargos
export const cargoImportSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cbo: z.string().optional(),
  departamento: z.string().optional(),
  nivel: z.enum(['Junior', 'Pleno', 'Senior', 'Especialista', 'Coordenador', 'Gerente', 'Diretor']).optional(),
  salario_base: z.coerce.number().positive().optional(),
  descricao: z.string().optional(),
});

// Schema para importação de Departamentos
export const departamentoImportSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().optional(),
  responsavel: z.string().optional(),
  centro_custo: z.string().optional(),
});

// Schema para importação de Documentos
export const documentoImportSchema = z.object({
  colaborador_cpf: z.string().min(1, 'CPF do colaborador é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  numero: z.string().optional(),
  data_emissao: z.string().optional(),
  data_validade: z.string().optional(),
  orgao_emissor: z.string().optional(),
});

// Colunas para templates de importação
export const importTemplates = {
  colaboradores: [
    { key: 'nome', label: 'Nome Completo', example: 'João da Silva' },
    { key: 'cpf', label: 'CPF', example: '123.456.789-00' },
    { key: 'email', label: 'E-mail', example: 'joao@empresa.com' },
    { key: 'telefone', label: 'Telefone', example: '(11) 99999-9999' },
    { key: 'data_nascimento', label: 'Data Nascimento', example: '01/01/1990' },
    { key: 'data_admissao', label: 'Data Admissão', example: '01/06/2024' },
    { key: 'cargo', label: 'Cargo', example: 'Analista' },
    { key: 'departamento', label: 'Departamento', example: 'TI' },
    { key: 'salario', label: 'Salário', example: '5000.00' },
    { key: 'tipo_contrato', label: 'Tipo Contrato', example: 'CLT' },
  ],
  ferias: [
    { key: 'colaborador_cpf', label: 'CPF Colaborador', example: '123.456.789-00' },
    { key: 'data_inicio', label: 'Data Início', example: '01/07/2024' },
    { key: 'data_fim', label: 'Data Fim', example: '30/07/2024' },
    { key: 'dias', label: 'Dias', example: '30' },
    { key: 'abono_pecuniario', label: 'Abono Pecuniário', example: 'Não' },
  ],
  afastamentos: [
    { key: 'colaborador_cpf', label: 'CPF Colaborador', example: '123.456.789-00' },
    { key: 'tipo', label: 'Tipo', example: 'Atestado' },
    { key: 'data_inicio', label: 'Data Início', example: '01/07/2024' },
    { key: 'data_fim', label: 'Data Fim', example: '03/07/2024' },
    { key: 'cid', label: 'CID', example: 'J11' },
    { key: 'motivo', label: 'Motivo', example: 'Gripe' },
  ],
  cargos: [
    { key: 'nome', label: 'Nome do Cargo', example: 'Analista de Sistemas' },
    { key: 'cbo', label: 'CBO', example: '2124-05' },
    { key: 'departamento', label: 'Departamento', example: 'TI' },
    { key: 'nivel', label: 'Nível', example: 'Pleno' },
    { key: 'salario_base', label: 'Salário Base', example: '5000.00' },
  ],
  departamentos: [
    { key: 'nome', label: 'Nome', example: 'Tecnologia da Informação' },
    { key: 'codigo', label: 'Código', example: 'TI-001' },
    { key: 'responsavel', label: 'Responsável', example: 'Maria Silva' },
    { key: 'centro_custo', label: 'Centro de Custo', example: 'CC-100' },
  ],
};

// Configuração de filtros por entidade
export const filterConfigs = {
  colaboradores: [
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
      { value: 'ferias', label: 'Em Férias' },
      { value: 'afastado', label: 'Afastado' },
    ]},
    { key: 'departamento', label: 'Departamento', type: 'select' as const, options: [] },
    { key: 'cargo', label: 'Cargo', type: 'select' as const, options: [] },
    { key: 'tipo_contrato', label: 'Tipo Contrato', type: 'select' as const, options: [
      { value: 'CLT', label: 'CLT' },
      { value: 'PJ', label: 'PJ' },
      { value: 'Estagiário', label: 'Estagiário' },
    ]},
    { key: 'data_admissao', label: 'Data Admissão', type: 'dateRange' as const },
  ],
  ferias: [
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'pendente', label: 'Pendente' },
      { value: 'aprovado', label: 'Aprovado' },
      { value: 'em_gozo', label: 'Em Gozo' },
      { value: 'concluido', label: 'Concluído' },
    ]},
    { key: 'data_inicio', label: 'Data Início', type: 'date' as const },
  ],
  folha: [
    { key: 'competencia', label: 'Competência', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'aberta', label: 'Aberta' },
      { value: 'processando', label: 'Processando' },
      { value: 'fechada', label: 'Fechada' },
    ]},
  ],
};

export type ColaboradorImport = z.infer<typeof colaboradorImportSchema>;
export type FeriasImport = z.infer<typeof feriasImportSchema>;
export type AfastamentoImport = z.infer<typeof afastamentoImportSchema>;
export type BeneficioImport = z.infer<typeof beneficioImportSchema>;
export type CargoImport = z.infer<typeof cargoImportSchema>;
export type DepartamentoImport = z.infer<typeof departamentoImportSchema>;
