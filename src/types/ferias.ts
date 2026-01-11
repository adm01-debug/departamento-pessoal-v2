// V15-162: src/types/ferias.ts
export interface Ferias {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  periodo_aquisitivo_inicio: string;
  periodo_aquisitivo_fim: string;
  dias_direito: number;
  dias_gozados: number;
  dias_vendidos: number;
  dias_restantes: number;
  status: StatusFerias;
  created_at: string;
  updated_at: string;
}

export interface SolicitacaoFerias {
  id: string;
  ferias_id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias_solicitados: number;
  abono_pecuniario: boolean;
  dias_abono: number;
  adiantamento_13: boolean;
  valor_ferias?: number;
  valor_abono?: number;
  valor_13?: number;
  valor_total?: number;
  status: StatusSolicitacao;
  aprovador_id?: string;
  data_aprovacao?: string;
  motivo_recusa?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export type StatusFerias = 'vigente' | 'gozando' | 'vencida' | 'quitada';
export type StatusSolicitacao = 'pendente' | 'aprovada' | 'recusada' | 'cancelada' | 'em_gozo' | 'concluida';

export interface FeriasFormData {
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  abono_pecuniario: boolean;
  dias_abono?: number;
  adiantamento_13: boolean;
  observacoes?: string;
}

export interface FeriasCalculo {
  dias_gozo: number;
  dias_abono: number;
  salario_base: number;
  media_variaveis: number;
  valor_ferias: number;
  terco_constitucional: number;
  valor_abono: number;
  valor_13?: number;
  inss: number;
  irrf: number;
  valor_liquido: number;
}
