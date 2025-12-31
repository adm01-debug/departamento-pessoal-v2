/**
 * @fileoverview Tipos para gestão de afastamentos
 * @module types/afastamento
 */

export type TipoAfastamento = 'doenca' | 'acidente_trabalho' | 'maternidade' | 'paternidade' | 'licenca_nao_remunerada' | 'servico_militar' | 'outro';
export type StatusAfastamento = 'ativo' | 'encerrado' | 'pendente' | 'cancelado' | 'prorrogado';

export interface Afastamento {
  id: string;
  colaborador_id: string;
  tipo: TipoAfastamento;
  motivo?: string;
  data_inicio: string;
  data_fim?: string;
  data_fim_prevista?: string;
  previsao_retorno?: string;
  status: StatusAfastamento;
  cid?: string;
  cid_descricao?: string;
  atestado_url?: string;
  atestado_numero?: string;
  dias_afastamento?: number;
  dias_total?: number;
  dias_empresa?: number;
  dias_inss?: number;
  medico_nome?: string;
  medico_crm?: string;
  numero_beneficio?: string;
  data_pericia?: string;
  prorrogado?: boolean;
  observacoes?: string;
  empresa_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface AfastamentoComColaborador extends Afastamento {
  colaborador?: {
    nome_completo: string;
    cargo: string;
    departamento: string;
    salario_base?: number;
  };
}

export interface ConfigAfastamento {
  id: string;
  tipo: TipoAfastamento;
  dias_empresa_maximo?: number;
  dias_maximos?: number;
  dias_minimos?: number;
  pago_empresa?: boolean;
  pago_inss?: boolean;
  descricao?: string;
  created_at?: string;
}

export interface AfastamentoFormData extends Omit<Afastamento, 'id' | 'created_at' | 'dias_afastamento'> {}

export interface AfastamentoFilters {
  colaborador_id?: string;
  tipo?: TipoAfastamento;
  status?: StatusAfastamento;
  data_inicio?: string;
  data_fim?: string;
}

export const TIPOS_AFASTAMENTO: Record<TipoAfastamento, string> = {
  doenca: 'Doença',
  acidente_trabalho: 'Acidente de Trabalho',
  maternidade: 'Licença Maternidade',
  paternidade: 'Licença Paternidade',
  licenca_nao_remunerada: 'Licença Não Remunerada',
  servico_militar: 'Serviço Militar',
  outro: 'Outro',
};

export const statusAfastamentoColors: Record<'ativo' | 'encerrado' | 'pendente', string> = {
  ativo: 'bg-red-500',
  encerrado: 'bg-green-500',
  pendente: 'bg-yellow-500',
};

export const STATUS_AFASTAMENTO: Record<'ativo' | 'encerrado' | 'pendente', string> = {
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  pendente: 'Pendente',
};
