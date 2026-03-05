// Tipos de Férias

export type StatusPeriodo = 'vigente' | 'vencida' | 'quitada';

export type StatusSolicitacao =
  | 'pendente'
  | 'aprovada'
  | 'recusada'
  | 'em_gozo'
  | 'concluida'
  | 'cancelada';

export type StatusFerias =
  | 'programada'
  | 'aprovada'
  | 'em_gozo'
  | 'concluida'
  | 'cancelada'
  | 'rejeitada'
  | 'solicitada';

export interface Ferias {
  id: string;
  colaborador_id: string;
  empresa_id?: string;
  periodo_aquisitivo_inicio: string;
  periodo_aquisitivo_fim: string;
  dias_direito: number;
  dias_gozados: number;
  dias_vendidos: number;
  dias_restantes: number;
  status: StatusPeriodo;
  created_at?: string;
  updated_at?: string;
}

export interface SolicitacaoFerias {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  empresa_id?: string;
  data_inicio: string;
  data_fim: string;
  dias_solicitados: number;
  abono_pecuniario: boolean;
  dias_abono: number;
  adiantamento_13: boolean;
  status: StatusSolicitacao | StatusFerias;
  aprovador_id?: string;
  aprovador_nome?: string;
  data_aprovacao?: string;
  motivo_recusa?: string;
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

export interface FeriasFormData {
  colaborador_id: string;
  data_inicio: Date | string;
  data_fim: Date | string;
  abono_pecuniario: boolean;
  dias_abono?: number;
  adiantamento_13: boolean;
  observacoes?: string;
}

export interface FeriasWithColaborador extends SolicitacaoFerias {
  colaborador: {
    id: string;
    nome: string;
    cargo?: string;
    departamento?: string;
  };
  dataInicio?: string;
  dataFim?: string;
  dias?: number;
  valor_ferias?: number;
  valorFerias?: number;
  valor_terco?: number;
  valor_total?: number;
  valorTotal?: number;
  observacao?: string;
  status: StatusFerias;
}

export type FeriasComColaborador = FeriasWithColaborador;

export interface CalculoFerias {
  salario_base: number;
  dias_gozo: number;
  dias_abono: number;
  valor_ferias: number;
  terco_constitucional: number;
  valor_abono: number;
  terco_abono: number;
  total_bruto: number;
  inss: number;
  irrf: number;
  total_descontos: number;
  total_liquido: number;
}

export interface FeriasFilters {
  colaborador_id?: string;
  status?: StatusSolicitacao;
  data_inicio?: string;
  data_fim?: string;
  empresa_id?: string;
}
