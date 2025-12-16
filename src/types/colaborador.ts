// Tipos baseados na tabela do banco de dados para colaboradores

export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'separado' | 'uniao_estavel';
export type Sexo = 'masculino' | 'feminino';
export type TipoContrato = 'clt' | 'pj' | 'estagiario' | 'temporario' | 'intermitente' | 'aprendiz';
export type StatusColaborador = 'ativo' | 'ferias' | 'afastado' | 'desligado' | 'pendente';
export type Escolaridade = 'fundamental_incompleto' | 'fundamental_completo' | 'medio_incompleto' | 'medio_completo' | 'superior_incompleto' | 'superior_completo' | 'pos_graduacao' | 'mestrado' | 'doutorado';
export type TipoConta = 'corrente' | 'poupanca' | 'salario';

export interface ColaboradorDB {
  id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Dados Pessoais
  nome_completo: string;
  nome_social?: string;
  cpf: string;
  rg?: string;
  rg_orgao_emissor?: string;
  rg_uf?: string;
  rg_data_emissao?: string;
  data_nascimento: string;
  sexo: Sexo;
  estado_civil: EstadoCivil;
  nacionalidade?: string;
  naturalidade_cidade?: string;
  naturalidade_uf?: string;
  nome_mae: string;
  nome_pai?: string;
  
  // Documentos Trabalhistas
  pis_pasep?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  ctps_uf?: string;
  ctps_data_emissao?: string;
  titulo_eleitor?: string;
  titulo_zona?: string;
  titulo_secao?: string;
  certificado_reservista?: string;
  cnh_numero?: string;
  cnh_categoria?: string;
  cnh_validade?: string;
  
  // Contato
  email?: string;
  telefone?: string;
  celular?: string;
  
  // Endereço
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  
  // Dados Bancários
  banco_codigo?: string;
  banco_nome?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: TipoConta;
  pix_tipo?: string;
  pix_chave?: string;
  
  // Dados Contratuais
  matricula?: string;
  data_admissao: string;
  data_desligamento?: string;
  tipo_contrato: TipoContrato;
  cargo: string;
  departamento: string;
  centro_custo?: string;
  local_trabalho?: string;
  cbo?: string;
  
  // Remuneração
  salario_base: number;
  tipo_salario?: string;
  
  // Jornada
  jornada_semanal?: number;
  horario_entrada?: string;
  horario_saida?: string;
  intervalo_minutos?: number;
  
  // Escolaridade e Qualificação
  escolaridade?: Escolaridade;
  formacao?: string;
  cursos_certificacoes?: string;
  
  // Status
  status: StatusColaborador;
  
  // Observações
  observacoes?: string;
  foto_url?: string;
}

export interface Dependente {
  id: string;
  colaborador_id: string;
  nome: string;
  cpf?: string;
  data_nascimento: string;
  parentesco: string;
  para_irrf: boolean;
  para_salario_familia: boolean;
  para_plano_saude: boolean;
  created_at: string;
}

export interface HistoricoCargo {
  id: string;
  colaborador_id: string;
  cargo_anterior?: string;
  cargo_novo: string;
  salario_anterior?: number;
  salario_novo: number;
  motivo?: string;
  data_alteracao: string;
  observacao?: string;
  created_at: string;
  created_by?: string;
}

export interface DocumentoColaborador {
  id: string;
  colaborador_id: string;
  tipo: string;
  nome_arquivo: string;
  url: string;
  tamanho_bytes?: number;
  created_at: string;
  created_by?: string;
}

// Labels para exibição
export const estadoCivilLabels: Record<EstadoCivil, string> = {
  solteiro: 'Solteiro(a)',
  casado: 'Casado(a)',
  divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)',
  separado: 'Separado(a)',
  uniao_estavel: 'União Estável',
};

export const sexoLabels: Record<Sexo, string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
};

export const tipoContratoLabels: Record<TipoContrato, string> = {
  clt: 'CLT',
  pj: 'PJ - Pessoa Jurídica',
  estagiario: 'Estagiário',
  temporario: 'Temporário',
  intermitente: 'Intermitente',
  aprendiz: 'Jovem Aprendiz',
};

export const statusColaboradorLabels: Record<StatusColaborador, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  desligado: 'Desligado',
  pendente: 'Pendente',
};

export const escolaridadeLabels: Record<Escolaridade, string> = {
  fundamental_incompleto: 'Fundamental Incompleto',
  fundamental_completo: 'Fundamental Completo',
  medio_incompleto: 'Médio Incompleto',
  medio_completo: 'Médio Completo',
  superior_incompleto: 'Superior Incompleto',
  superior_completo: 'Superior Completo',
  pos_graduacao: 'Pós-Graduação',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
};

export const tipoContaLabels: Record<TipoConta, string> = {
  corrente: 'Conta Corrente',
  poupanca: 'Conta Poupança',
  salario: 'Conta Salário',
};

export const ufOptions = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const parentescoOptions = [
  'Filho(a)',
  'Cônjuge',
  'Companheiro(a)',
  'Pai',
  'Mãe',
  'Enteado(a)',
  'Menor sob guarda',
  'Irmão(ã)',
  'Avô/Avó',
  'Outro',
];

export const cnhCategorias = ['A', 'B', 'AB', 'C', 'D', 'E', 'ACC'];

export const departamentosDefault = [
  'Gravação',
  'Artes',
  'Comercial',
  'Administrativo',
  'Logística',
  'Financeiro',
  'Produção',
  'RH',
  'TI',
];

export const bancosComuns = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú' },
  { codigo: '077', nome: 'Banco Inter' },
  { codigo: '260', nome: 'Nubank' },
  { codigo: '336', nome: 'C6 Bank' },
  { codigo: '212', nome: 'Banco Original' },
  { codigo: '756', nome: 'Sicoob' },
  { codigo: '748', nome: 'Sicredi' },
];
