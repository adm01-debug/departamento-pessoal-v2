// Status types
export type StatusColaborador = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'licenca' | 'demitido';
export type Sexo = 'M' | 'F';
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'autonomo';
export type Escolaridade = 'fundamental' | 'medio' | 'tecnico' | 'superior' | 'pos_graduacao' | 'mestrado' | 'doutorado';
export type TipoConta = 'corrente' | 'poupanca';

// Interfaces
export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: TipoConta;
  titular: string;
  cpfTitular: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  nome_completo?: string;
  cpf: string;
  rg?: string;
  dataNascimento: string;
  data_nascimento?: string;
  sexo: Sexo;
  estadoCivil: EstadoCivil;
  estado_civil?: string;
  email: string;
  telefone: string;
  celular?: string;
  cargoId?: string;
  cargo: string;
  departamentoId?: string;
  departamento: string;
  dataAdmissao: string;
  data_admissao?: string;
  dataDemissao?: string;
  data_demissao?: string;
  salario: number;
  salario_base?: number;
  status: StatusColaborador;
  avatar?: string;
  foto_url?: string;
  endereco?: Endereco;
  dadosBancarios?: DadosBancarios;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
  matricula?: string;
  tipo_contrato?: string;
}

export type ColaboradorDB = Colaborador;

export interface ColaboradorFormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargoId: string;
  departamentoId: string;
  dataAdmissao: string;
  salario: number;
}

// Labels
export const statusColaboradorLabels: Record<StatusColaborador, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  licenca: 'Licença',
  demitido: 'Demitido',
};

export const sexoLabels: Record<Sexo, string> = {
  M: 'Masculino',
  F: 'Feminino',
};

export const estadoCivilLabels: Record<EstadoCivil, string> = {
  solteiro: 'Solteiro(a)',
  casado: 'Casado(a)',
  divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)',
  uniao_estavel: 'União Estável',
};

export const tipoContratoLabels: Record<TipoContrato, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário',
  autonomo: 'Autônomo',
};

export const escolaridadeLabels: Record<Escolaridade, string> = {
  fundamental: 'Ensino Fundamental',
  medio: 'Ensino Médio',
  tecnico: 'Ensino Técnico',
  superior: 'Ensino Superior',
  pos_graduacao: 'Pós-Graduação',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
};

export const tipoContaLabels: Record<TipoConta, string> = {
  corrente: 'Conta Corrente',
  poupanca: 'Conta Poupança',
};

// Options arrays
export const ufOptions = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const cnhCategorias = ['A', 'B', 'AB', 'C', 'D', 'E', 'ACC'];

export const departamentosDefault = [
  'Administrativo',
  'Comercial',
  'Contabilidade',
  'Financeiro',
  'Jurídico',
  'Marketing',
  'Operações',
  'Recursos Humanos',
  'TI',
  'Vendas',
];

export const bancosComuns = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú Unibanco' },
  { codigo: '356', nome: 'Banco Real' },
  { codigo: '389', nome: 'Banco Mercantil do Brasil' },
  { codigo: '399', nome: 'HSBC' },
  { codigo: '422', nome: 'Banco Safra' },
  { codigo: '453', nome: 'Banco Rural' },
  { codigo: '633', nome: 'Banco Rendimento' },
  { codigo: '652', nome: 'Itaú Holding' },
  { codigo: '745', nome: 'Banco Citibank' },
  { codigo: '756', nome: 'Bancoob' },
  { codigo: '260', nome: 'Nu Pagamentos (Nubank)' },
  { codigo: '077', nome: 'Banco Inter' },
  { codigo: '336', nome: 'Banco C6' },
  { codigo: '212', nome: 'Banco Original' },
  { codigo: '380', nome: 'PicPay' },
  { codigo: '290', nome: 'PagBank' },
];

export const statusOptions = Object.entries(statusColaboradorLabels).map(([value, label]) => ({
  value,
  label,
}));

export const sexoOptions = Object.entries(sexoLabels).map(([value, label]) => ({
  value,
  label,
}));

export const estadoCivilOptions = Object.entries(estadoCivilLabels).map(([value, label]) => ({
  value,
  label,
}));

export const tipoContratoOptions = Object.entries(tipoContratoLabels).map(([value, label]) => ({
  value,
  label,
}));

export const escolaridadeOptions = Object.entries(escolaridadeLabels).map(([value, label]) => ({
  value,
  label,
}));

export const tipoContaOptions = Object.entries(tipoContaLabels).map(([value, label]) => ({
  value,
  label,
}));
