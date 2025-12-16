export type TipoDia = 'normal' | 'feriado' | 'compensado' | 'folga' | 'falta' | 'atestado' | 'ferias' | 'licenca';
export type StatusAjuste = 'pendente' | 'aprovado' | 'rejeitado';
export type StatusPeriodo = 'aberto' | 'fechado' | 'processado';
export type TipoBancoHoras = 'credito' | 'debito';
export type TipoFeriado = 'nacional' | 'estadual' | 'municipal' | 'facultativo';

export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  data: string;
  entrada_1: string | null;
  saida_1: string | null;
  entrada_2: string | null;
  saida_2: string | null;
  entrada_3: string | null;
  saida_3: string | null;
  horas_trabalhadas: string | null;
  horas_extras: string | null;
  horas_falta: string | null;
  tipo_dia: TipoDia;
  justificativa: string | null;
  aprovado: boolean;
  aprovado_por: string | null;
  aprovado_em: string | null;
  observacoes: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface BancoHoras {
  id: string;
  colaborador_id: string;
  data: string;
  tipo: TipoBancoHoras;
  horas: string;
  motivo: string | null;
  registro_ponto_id: string | null;
  saldo_anterior: string | null;
  saldo_atual: string | null;
  created_at: string;
  created_by: string | null;
}

export interface AjustePonto {
  id: string;
  registro_ponto_id: string;
  colaborador_id: string;
  campo_alterado: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  motivo: string;
  status: StatusAjuste;
  aprovado_por: string | null;
  aprovado_em: string | null;
  created_at: string;
  created_by: string | null;
}

export interface PeriodoPonto {
  id: string;
  competencia: string;
  data_inicio: string;
  data_fim: string;
  status: StatusPeriodo;
  fechado_em: string | null;
  fechado_por: string | null;
  created_at: string;
}

export interface Feriado {
  id: string;
  data: string;
  descricao: string;
  tipo: TipoFeriado;
  uf: string | null;
  cidade: string | null;
  created_at: string;
}

export interface EspelhoPonto {
  colaborador_id: string;
  colaborador_nome: string;
  colaborador_cargo: string;
  colaborador_departamento: string;
  competencia: string;
  registros: RegistroPonto[];
  total_horas_trabalhadas: string;
  total_horas_extras: string;
  total_horas_falta: string;
  saldo_banco_horas: string;
}

export interface ResumoMensal {
  dias_trabalhados: number;
  dias_uteis: number;
  horas_previstas: string;
  horas_trabalhadas: string;
  horas_extras_50: string;
  horas_extras_100: string;
  horas_falta: string;
  atrasos: string;
  banco_horas_credito: string;
  banco_horas_debito: string;
  saldo_banco_horas: string;
}
