/**
 * @fileoverview Tipos para férias
 * @module types/ferias
 * @version V8.1 - Corrigido por análise QA
 */

// ============================================
// STATUS
// ============================================

export type StatusFerias = 
  | 'solicitada'
  | 'aprovada' 
  | 'rejeitada'
  | 'programada' 
  | 'em_gozo' 
  | 'concluida' 
  | 'cancelada';

export type TipoFerias = 
  | 'integral'      // 30 dias
  | 'fracionada'    // 2 ou 3 períodos
  | 'coletiva';     // Férias coletivas

// ============================================
// INTERFACES PRINCIPAIS
// ============================================

/**
 * Férias do colaborador
 */
export interface Ferias {
  id: string;
  colaborador_id: string;
  empresa_id: string;
  
  // Período
  data_inicio: string;
  data_fim: string;
  dias: number;
  tipo: TipoFerias;
  
  // Período aquisitivo
  periodo_aquisitivo_inicio?: string;
  periodo_aquisitivo_fim?: string;
  
  // Abono pecuniário
  abono_pecuniario: boolean;
  dias_abono?: number;
  
  // Valores
  valor_ferias?: number;
  valor_abono?: number;
  valor_terco?: number;
  valor_total?: number;
  
  // Status e aprovação
  status: StatusFerias;
  aprovador_id?: string;
  data_aprovacao?: string;
  data_pagamento?: string;
  
  // Observações
  observacoes?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  
  // Relations (opcional)
  colaborador?: {
    id: string;
    nome: string;
    cpf?: string;
    salario?: number;
    data_admissao?: string;
  };
  aprovador?: {
    id: string;
    nome: string;
  };
}

/**
 * Dados para criação/edição de férias
 */
export interface FeriasFormData {
  colaborador_id: string;
  empresa_id?: string;
  data_inicio: string;
  data_fim: string;
  dias: number;
  tipo?: TipoFerias;
  abono_pecuniario?: boolean;
  dias_abono?: number;
  periodo_aquisitivo_inicio?: string;
  periodo_aquisitivo_fim?: string;
  observacoes?: string;
  status?: StatusFerias;
  aprovador_id?: string;
  data_aprovacao?: string;
}

/**
 * Filtros para listagem de férias
 */
export interface FeriasFilters {
  empresa_id?: string;
  colaborador_id?: string;
  status?: StatusFerias;
  tipo?: TipoFerias;
  ano?: number;
  mes?: number;
  dataInicio?: string;
  dataFim?: string;
}

// ============================================
// SALDO E PERÍODO AQUISITIVO
// ============================================

/**
 * Saldo de férias do colaborador
 */
export interface SaldoFerias {
  colaborador_id: string;
  colaborador_nome?: string;
  dias_direito: number;
  dias_gozados: number;
  dias_programados: number;
  dias_disponiveis: number;
  periodos_aquisitivos: PeriodoAquisitivo[];
  proximo_vencimento?: string;
  tem_ferias_vencidas: boolean;
}

/**
 * Período aquisitivo de férias
 */
export interface PeriodoAquisitivo {
  numero: number;
  inicio: string;
  fim: string;
  dias_direito: number;
  dias_gozados: number;
  dias_programados: number;
  dias_restantes: number;
  data_limite: string;
  vencido: boolean;
  dobrado: boolean;
}

// ============================================
// PROGRAMAÇÃO DE FÉRIAS
// ============================================

/**
 * Programação anual de férias
 */
export interface ProgramacaoFerias {
  id: string;
  ano: number;
  empresa_id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  departamento_id?: string;
  departamento_nome?: string;
  meses: ProgramacaoMes[];
  status: 'rascunho' | 'enviada' | 'aprovada';
  created_at?: string;
}

export interface ProgramacaoMes {
  mes: number;
  dias: number;
  observacao?: string;
}

// ============================================
// CÁLCULO DE FÉRIAS
// ============================================

/**
 * Resultado do cálculo de férias
 */
export interface CalculoFerias {
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias_gozo: number;
  dias_abono: number;
  
  // Proventos
  salario_base: number;
  media_variaveis?: number;
  valor_ferias: number;
  valor_abono: number;
  valor_terco: number;
  total_bruto: number;
  
  // Descontos
  inss: number;
  irrf: number;
  outros_descontos: number;
  total_descontos: number;
  
  // Líquido
  valor_liquido: number;
  
  // Data de pagamento (até 2 dias antes do início)
  data_pagamento: string;
}

// ============================================
// LABELS
// ============================================

export const statusFeriasLabels: Record<StatusFerias, string> = {
  solicitada: 'Solicitada',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  programada: 'Programada',
  em_gozo: 'Em Gozo',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export const tipoFeriasLabels: Record<TipoFerias, string> = {
  integral: 'Integral (30 dias)',
  fracionada: 'Fracionada',
  coletiva: 'Coletiva',
};

export const statusFeriasColors: Record<StatusFerias, string> = {
  solicitada: 'bg-yellow-100 text-yellow-800',
  aprovada: 'bg-green-100 text-green-800',
  rejeitada: 'bg-red-100 text-red-800',
  programada: 'bg-blue-100 text-blue-800',
  em_gozo: 'bg-purple-100 text-purple-800',
  concluida: 'bg-gray-100 text-gray-800',
  cancelada: 'bg-red-100 text-red-800',
};

// ============================================
// TIPOS COMPOSTOS
// ============================================

export interface FeriasComColaborador extends Ferias {
  colaborador: {
    id: string;
    nome: string;
    cpf?: string;
    salario?: number;
    data_admissao?: string;
  };
}

export interface HistoricoFerias {
  id: string;
  ferias_id: string;
  acao: 'criada' | 'aprovada' | 'rejeitada' | 'cancelada' | 'editada';
  usuario_id: string;
  usuario_nome?: string;
  observacao?: string;
  created_at: string;
}
