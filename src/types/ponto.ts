/**
 * @fileoverview Tipos para ponto
 * @module types/ponto
 */
export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  data: string;
  entrada?: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
  horas_trabalhadas?: number;
  horas_extras?: number;
  observacoes?: string;
  justificativa?: string;
  status?: 'normal' | 'falta' | 'justificado' | 'feriado' | 'ferias';
  created_at?: string;
}

export interface PontoFilters {
  colaborador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: RegistroPonto['status'];
}

export interface ResumoPonto {
  colaborador_id: string;
  mes: number;
  ano: number;
  dias_trabalhados: number;
  horas_trabalhadas: number;
  horas_extras: number;
  faltas: number;
  atrasos: number;
}

export interface PeriodoPonto {
  id: string;
  data_inicio: string;
  data_fim: string;
  status: 'aberto' | 'fechado';
  empresa_id: string;
}
