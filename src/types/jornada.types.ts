// Tipos de Jornada
export type TipoJornada = 'NORMAL' | 'FLEXIVEL' | 'ESCALA' | 'PLANTAO' | 'INTERMITENTE';

export interface Jornada {
  id: string;
  codigo: string;
  descricao: string;
  tipo: TipoJornada;
  horaInicio: string;
  horaFim: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  cargaHorariaDiaria: number;
  cargaHorariaSemanal?: number;
  cargaHorariaMensal?: number;
  diasSemana: number[];
  toleranciaEntrada?: number;
  toleranciaSaida?: number;
  permiteHoraExtra?: boolean;
  permiteBancoHoras?: boolean;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JornadaFormData {
  codigo: string;
  descricao: string;
  tipo: TipoJornada;
  horaInicio: string;
  horaFim: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  cargaHorariaDiaria: number;
  cargaHorariaSemanal?: number;
  cargaHorariaMensal?: number;
  diasSemana: number[];
  toleranciaEntrada?: number;
  toleranciaSaida?: number;
  permiteHoraExtra?: boolean;
  permiteBancoHoras?: boolean;
  ativo: boolean;
}
