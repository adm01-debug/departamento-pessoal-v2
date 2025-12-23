export interface Ferias {
  id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias_gozo: number;
  dias_abono?: number;
  abono_pecuniario?: boolean;
  status: 'programada' | 'aprovada' | 'em_gozo' | 'concluida' | 'cancelada';
  aprovador_id?: string;
  data_aprovacao?: string;
  observacoes?: string;
  created_at?: string;
}

export interface FeriasFormData extends Omit<Ferias, 'id' | 'created_at' | 'aprovador_id' | 'data_aprovacao'> {}

export interface FeriasFilters {
  colaborador_id?: string;
  status?: Ferias['status'];
  ano?: number;
}

export interface SaldoFerias {
  colaborador_id: string;
  dias_direito: number;
  dias_gozados: number;
  dias_programados: number;
  dias_disponiveis: number;
  periodo_aquisitivo_inicio: string;
  periodo_aquisitivo_fim: string;
}
