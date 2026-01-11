// V15-159: src/types/colaborador.ts
export interface Colaborador {
  id: string;
  empresa_id: string;
  nome: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  sexo?: 'M' | 'F';
  estado_civil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  nome_mae?: string;
  nome_pai?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: Endereco;
  pis?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  ctps_uf?: string;
  titulo_eleitor?: string;
  reservista?: string;
  cnh_numero?: string;
  cnh_categoria?: string;
  cnh_validade?: string;
  data_admissao: string;
  data_demissao?: string;
  cargo_id?: string;
  departamento_id?: string;
  salario: number;
  tipo_contrato: TipoContrato;
  jornada_trabalho?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: 'corrente' | 'poupanca';
  foto_url?: string;
  status: StatusColaborador;
  created_at: string;
  updated_at: string;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export type StatusColaborador = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';
export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'autonomo';

export interface ColaboradorFormData extends Omit<Colaborador, 'id' | 'created_at' | 'updated_at'> {}

export interface ColaboradorFilters {
  search?: string;
  status?: StatusColaborador;
  departamento_id?: string;
  cargo_id?: string;
}
