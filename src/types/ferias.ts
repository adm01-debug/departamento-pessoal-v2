export interface Ferias {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  dataInicio: string;
  dataFim: string;
  dias: number;
  abonoPecuniario: boolean;
  diasAbono: number;
  status: StatusFerias;
  valorFerias: number;
  valorAbono: number;
  valorTotal: number;
  aprovadoPor?: string;
  aprovadoEm?: string;
  observacao?: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusFerias = 
  | 'programada' 
  | 'aprovada' 
  | 'em_gozo' 
  | 'concluida' 
  | 'cancelada'
  | 'rejeitada'
  | 'solicitada';

export interface FeriasFormData {
  colaboradorId: string;
  dataInicio: string;
  dataFim: string;
  dias: number;
  abonoPecuniario: boolean;
  diasAbono?: number;
  observacao?: string;
}

export interface SaldoFerias {
  colaboradorId: string;
  diasDisponiveis: number;
  diasGozados: number;
  diasVendidos: number;
  periodoAquisitivo: {
    inicio: string;
    fim: string;
  };
  venceEm: string;
}

// Interface for ferias with colaborador data (from database with snake_case)
export interface FeriasComColaborador {
  id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias: number;
  status: StatusFerias;
  valor_ferias?: number;
  valor_terco?: number;
  valor_total?: number;
  observacoes?: string;
  colaborador?: {
    id: string;
    nome: string;
    nome_completo?: string;
    cargo?: string;
    departamento?: string;
  };
  // Also support camelCase for compatibility
  dataInicio?: string;
  dataFim?: string;
  valorFerias?: number;
  valorTotal?: number;
  observacao?: string;
}

export interface HistoricoFerias {
  id: string;
  ferias_id: string;
  status_anterior?: string;
  status_novo: string;
  observacao?: string;
  created_at: string;
  created_by?: string;
}
