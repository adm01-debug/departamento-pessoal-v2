// V15-163: src/types/ponto.ts
export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  data: string;
  tipo: TipoRegistro;
  hora: string;
  latitude?: number;
  longitude?: number;
  endereco?: string;
  foto_url?: string;
  dispositivo?: string;
  ip?: string;
  observacao?: string;
  ajustado: boolean;
  motivo_ajuste?: string;
  aprovador_ajuste_id?: string;
  created_at: string;
}

export interface EspelhoPonto {
  colaborador_id: string;
  colaborador_nome: string;
  competencia: string;
  dias: DiaPonto[];
  resumo: ResumoPonto;
}

export interface DiaPonto {
  data: string;
  dia_semana: string;
  registros: RegistroPonto[];
  horas_trabalhadas: number;
  horas_extras_50: number;
  horas_extras_100: number;
  horas_noturnas: number;
  atrasos: number;
  faltas: number;
  tipo_dia: TipoDia;
  justificativa?: string;
}

export interface ResumoPonto {
  dias_trabalhados: number;
  horas_trabalhadas: number;
  horas_extras_50: number;
  horas_extras_100: number;
  horas_noturnas: number;
  atrasos_minutos: number;
  faltas_dias: number;
  banco_horas_saldo: number;
}

export type TipoRegistro = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida';
export type TipoDia = 'util' | 'feriado' | 'domingo' | 'sabado' | 'compensado' | 'falta' | 'atestado' | 'ferias';

export interface PontoConfig {
  tolerancia_minutos: number;
  intervalo_minimo: number;
  permite_banco_horas: boolean;
  exige_foto: boolean;
  exige_localizacao: boolean;
  horario_padrao: HorarioPadrao;
}

export interface HorarioPadrao {
  entrada: string;
  saida_almoco: string;
  retorno_almoco: string;
  saida: string;
}
