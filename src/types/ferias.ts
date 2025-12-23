export type StatusPeriodoAquisitivo = 'em_aquisicao' | 'adquirido' | 'vencido' | 'gozado' | 'pago';
export type StatusFerias = 'programada' | 'aprovada' | 'em_gozo' | 'concluida' | 'cancelada';

export interface PeriodoAquisitivo {
  id: string;
  colaborador_id: string;
  numero_periodo: number;
  data_inicio: string;
  data_fim: string;
  dias_direito: number;
  faltas_periodo: number;
  dias_descontados: number;
  status: StatusPeriodoAquisitivo;
  created_at: string;
}

export interface Ferias {
  id: string;
  colaborador_id: string;
  periodo_aquisitivo_id: string | null;
  data_inicio: string;
  data_fim: string;
  dias_gozo: number;
  dias_abono: number;
  vender_abono: boolean;
  data_pagamento: string | null;
  salario_base: number;
  valor_ferias: number;
  valor_terco: number;
  valor_abono: number;
  valor_terco_abono: number;
  valor_total: number;
  descontos_inss: number;
  descontos_irrf: number;
  valor_liquido: number;
  status: StatusFerias;
  aprovado_por: string | null;
  aprovado_em: string | null;
  observacoes: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface HistoricoFerias {
  id: string;
  ferias_id: string;
  status_anterior: string | null;
  status_novo: string;
  observacao: string | null;
  created_at: string;
  created_by: string | null;
}

export interface CalculoFerias {
  salarioBase: number;
  diasGozo: number;
  diasAbono: number;
  valorFerias: number;
  valorTerco: number;
  valorAbono: number;
  valorTercoAbono: number;
  valorBruto: number;
  descontoINSS: number;
  descontoIRRF: number;
  valorLiquido: number;
}

export interface FeriasComColaborador extends Ferias {
  colaborador_nome?: string;
  colaborador_cargo?: string;
  colaborador_departamento?: string;
}

