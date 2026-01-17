// V18: Tipos de Férias - Formatado e Documentado

/**
 * Status do período aquisitivo
 */
export type StatusPeriodo = 'vigente' | 'vencida' | 'quitada';

/**
 * Status da solicitação de férias
 */
export type StatusSolicitacao = 
  | 'pendente' 
  | 'aprovada' 
  | 'recusada' 
  | 'em_gozo' 
  | 'concluida'
  | 'cancelada';

/**
 * Período aquisitivo de férias
 */
export interface Ferias {
  id: string;
  colaborador_id: string;
  empresa_id?: string;
  
  // Período aquisitivo
  periodo_aquisitivo_inicio: string;
  periodo_aquisitivo_fim: string;
  
  // Dias
  dias_direito: number;
  dias_gozados: number;
  dias_vendidos: number;
  dias_restantes: number;
  
  // Status
  status: StatusPeriodo;
  
  // Metadados
  created_at?: string;
  updated_at?: string;
}

/**
 * Solicitação de férias
 */
export interface SolicitacaoFerias {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  empresa_id?: string;
  
  // Período de gozo
  data_inicio: string;
  data_fim: string;
  dias_solicitados: number;
  
  // Opcionais
  abono_pecuniario: boolean;
  dias_abono: number;
  adiantamento_13: boolean;
  
  // Aprovação
  status: StatusSolicitacao;
  aprovador_id?: string;
  aprovador_nome?: string;
  data_aprovacao?: string;
  motivo_recusa?: string;
  
  // Observações
  observacoes?: string;
  
  // Metadados
  created_at: string;
  updated_at?: string;
}

/**
 * Dados do formulário de férias
 */
export interface FeriasFormData {
  colaborador_id: string;
  data_inicio: Date | string;
  data_fim: Date | string;
  abono_pecuniario: boolean;
  dias_abono?: number;
  adiantamento_13: boolean;
  observacoes?: string;
}

/**
 * Férias com dados do colaborador
 */
export interface FeriasWithColaborador extends SolicitacaoFerias {
  colaborador: {
    id: string;
    nome: string;
    cargo?: string;
    departamento?: string;
  };
}

/**
 * Cálculo de férias
 */
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

/**
 * Filtros para listagem de férias
 */
export interface FeriasFilters {
  colaborador_id?: string;
  status?: StatusSolicitacao;
  data_inicio?: string;
  data_fim?: string;
  empresa_id?: string;
}
