/**
 * @fileoverview Tipos para gestão de afastamentos
 * @module types/afastamento
 */

export interface Afastamento {
  id: string;
  colaborador_id: string;
  tipo: 'doenca' | 'acidente_trabalho' | 'maternidade' | 'paternidade' | 'licenca_nao_remunerada' | 'servico_militar' | 'outro';
  motivo?: string;
  data_inicio: string;
  data_fim?: string;
  previsao_retorno?: string;
  status: 'ativo' | 'encerrado' | 'pendente';
  cid?: string;
  atestado_url?: string;
  dias_afastamento?: number;
  prorrogado?: boolean;
  observacoes?: string;
  created_at?: string;
}

export interface AfastamentoFormData extends Omit<Afastamento, 'id' | 'created_at' | 'dias_afastamento'> {}

export interface AfastamentoFilters {
  colaborador_id?: string;
  tipo?: Afastamento['tipo'];
  status?: Afastamento['status'];
  data_inicio?: string;
  data_fim?: string;
}

export const TIPOS_AFASTAMENTO: Record<Afastamento['tipo'], string> = {
  doenca: 'Doença',
  acidente_trabalho: 'Acidente de Trabalho',
  maternidade: 'Licença Maternidade',
  paternidade: 'Licença Paternidade',
  licenca_nao_remunerada: 'Licença Não Remunerada',
  servico_militar: 'Serviço Militar',
  outro: 'Outro',
};

export const statusAfastamentoColors: Record<Afastamento['status'], string> = {
  ativo: 'bg-red-500',
  encerrado: 'bg-green-500',
  pendente: 'bg-yellow-500',
};

export const STATUS_AFASTAMENTO: Record<Afastamento['status'], string> = {
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  pendente: 'Pendente',
};
