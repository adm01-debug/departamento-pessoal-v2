// V18: Tipos de Colaborador - Completo
export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'autonomo';
export type StatusColaborador = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
export type Sexo = 'masculino' | 'feminino' | 'outro';
export type Escolaridade = 'fundamental' | 'medio' | 'superior' | 'pos_graduacao' | 'mestrado' | 'doutorado';
export type TipoConta = 'corrente' | 'poupanca' | 'salario';

export type ColaboradorDB = Colaborador;

export const estadoCivilLabels: Record<EstadoCivil, string> = {
  solteiro: 'Solteiro(a)', casado: 'Casado(a)', divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)', uniao_estavel: 'União Estável'
};

export const sexoLabels: Record<Sexo, string> = {
  masculino: 'Masculino', feminino: 'Feminino', outro: 'Outro'
};

export const tipoContratoLabels: Record<TipoContrato, string> = {
  clt: 'CLT', pj: 'PJ', estagio: 'Estágio', temporario: 'Temporário', autonomo: 'Autônomo'
};

export const statusColaboradorLabels: Record<StatusColaborador, string> = {
  ativo: 'Ativo', inativo: 'Inativo', ferias: 'Férias', afastado: 'Afastado', demitido: 'Demitido'
};

export const escolaridadeLabels: Record<Escolaridade, string> = {
  fundamental: 'Fundamental', medio: 'Médio', superior: 'Superior',
  pos_graduacao: 'Pós-Graduação', mestrado: 'Mestrado', doutorado: 'Doutorado'
};

export const tipoContaLabels: Record<TipoConta, string> = {
  corrente: 'Conta Corrente', poupanca: 'Poupança', salario: 'Conta Salário'
};

export const ufOptions = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

export const cnhCategorias = ['A', 'B', 'AB', 'C', 'D', 'E', 'ACC'];

export const departamentosDefault = [
  'Administrativo', 'Comercial', 'Contabilidade', 'Financeiro', 'Jurídico',
  'Marketing', 'Operações', 'Recursos Humanos', 'TI', 'Vendas'
];

export const bancosComuns = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú' },
  { codigo: '356', nome: 'Banco Real' },
  { codigo: '389', nome: 'Mercantil do Brasil' },
  { codigo: '399', nome: 'HSBC' },
  { codigo: '422', nome: 'Safra' },
  { codigo: '745', nome: 'Citibank' },
  { codigo: '756', nome: 'Sicoob' },
  { codigo: '041', nome: 'Banrisul' },
  { codigo: '077', nome: 'Inter' },
  { codigo: '260', nome: 'Nubank' },
  { codigo: '336', nome: 'C6 Bank' },
];

export interface Colaborador {
  id: string;
  empresa_id: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  celular?: string;
  data_nascimento?: string;
  foto_url?: string;
  rg?: string;
  pis?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  data_admissao: string;
  data_demissao?: string;
  salario: number;
  cargo_id?: string;
  cargo?: string;
  departamento_id?: string;
  departamento?: string;
  tipo_contrato: TipoContrato;
  status: StatusColaborador;
  estado_civil?: EstadoCivil;
  sexo?: Sexo;
  escolaridade?: Escolaridade;
  banco?: string;
  agencia?: string;
  conta?: string;
  conta_tipo?: TipoConta;
  pix?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  endereco?: string;
  created_at: string;
  updated_at: string;
}

export interface ColaboradorFormData extends Omit<Colaborador, 'id' | 'created_at' | 'updated_at'> {}

export interface ColaboradorFilters {
  search?: string;
  status?: StatusColaborador;
  departamento_id?: string;
  cargo_id?: string;
  tipo_contrato?: TipoContrato;
  empresa_id?: string;
}

export interface ColaboradorWithRelations extends Colaborador {
  cargo_info?: { id: string; nome: string; cbo?: string; };
  departamento_info?: { id: string; nome: string; };
  dependentes?: Array<{ id: string; nome: string; parentesco: string; data_nascimento: string; }>;
}

export interface ColaboradorResumo {
  id: string;
  nome: string;
  cpf: string;
  cargo?: string;
  departamento?: string;
  status: StatusColaborador;
}
