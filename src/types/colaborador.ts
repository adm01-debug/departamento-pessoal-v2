// Use 'any' for flexible compatibility with database schema
// This allows ColaboradorFormCompleto and other components to work with full DB records
export type Colaborador = Record<string, any> & {
  id: string;
  nome_completo?: string;
  nome?: string;
  cpf: string;
  cargo: string;
  departamento: string;
  status?: string;
  salario_base?: number;
  salario?: number;
  data_admissao?: string;
  dataAdmissao?: string;
  created_at?: string;
  updated_at?: string;
};

export type ColaboradorDB = Colaborador;
export type StatusColaborador = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'licenca' | 'demitido';
export type Sexo = 'M' | 'F' | 'masculino' | 'feminino';
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'autonomo';
export type Escolaridade = 'fundamental' | 'medio' | 'tecnico' | 'superior' | 'pos_graduacao' | 'mestrado' | 'doutorado';
export type TipoConta = 'corrente' | 'poupanca';

export interface ColaboradorFormData {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  salario_base: number;
}

// Labels
export const statusColaboradorLabels: Record<string, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  licenca: 'Licença',
  demitido: 'Demitido',
};

export const sexoLabels: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  masculino: 'Masculino',
  feminino: 'Feminino',
};

export const estadoCivilLabels: Record<string, string> = {
  solteiro: 'Solteiro(a)',
  casado: 'Casado(a)',
  divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)',
  uniao_estavel: 'União Estável',
};

export const tipoContratoLabels: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário',
  autonomo: 'Autônomo',
};

export const escolaridadeLabels: Record<string, string> = {
  fundamental: 'Ensino Fundamental',
  medio: 'Ensino Médio',
  tecnico: 'Ensino Técnico',
  superior: 'Ensino Superior',
  pos_graduacao: 'Pós-Graduação',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
};

export const tipoContaLabels: Record<string, string> = {
  corrente: 'Conta Corrente',
  poupanca: 'Conta Poupança',
};

// Options
export const ufOptions = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
export const cnhCategorias = ['A', 'B', 'AB', 'C', 'D', 'E', 'ACC'];
export const departamentosDefault = ['Administrativo', 'Comercial', 'Contabilidade', 'Financeiro', 'Jurídico', 'Marketing', 'Operações', 'Recursos Humanos', 'TI', 'Vendas'];
export const bancosComuns = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú Unibanco' },
  { codigo: '260', nome: 'Nu Pagamentos (Nubank)' },
  { codigo: '077', nome: 'Banco Inter' },
  { codigo: '336', nome: 'Banco C6' },
];

export const statusOptions = Object.entries(statusColaboradorLabels).map(([value, label]) => ({ value, label }));
export const sexoOptions = Object.entries(sexoLabels).map(([value, label]) => ({ value, label }));
export const estadoCivilOptions = Object.entries(estadoCivilLabels).map(([value, label]) => ({ value, label }));
export const tipoContratoOptions = Object.entries(tipoContratoLabels).map(([value, label]) => ({ value, label }));
export const escolaridadeOptions = Object.entries(escolaridadeLabels).map(([value, label]) => ({ value, label }));
export const tipoContaOptions = Object.entries(tipoContaLabels).map(([value, label]) => ({ value, label }));
