export type TipoJornada = "NORMAL" | "FLEXIVEL" | "ESCALA" | "PLANTAO" | "INTERMITENTE";

export interface Jornada {
  id: string;
  codigo: string;
  descricao: string;
  horaInicio: string;
  horaFim: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  cargaHorariaDiaria: number;
  cargaHorariaSemanal: number;
  cargaHorariaMensal: number;
  tipo: TipoJornada;
  diasSemana: number[];
  toleranciaEntrada: number;
  toleranciaSaida: number;
  permiteHoraExtra: boolean;
  permiteBancoHoras: boolean;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JornadaFilter {
  tipo?: TipoJornada;
  ativo?: boolean;
  search?: string;
}

export interface JornadaStats {
  total: number;
  ativos: number;
  inativos: number;
  porTipo: Record<TipoJornada, number>;
}

export interface JornadaFormData extends Omit<Jornada, "id" | "createdAt" | "updatedAt"> {}

export interface JornadaListProps {
  jornadas: Jornada[];
  onEdit?: (jornada: Jornada) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export interface JornadaCardProps {
  jornada: Jornada;
  onEdit?: () => void;
  onDelete?: () => void;
}
