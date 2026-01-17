// V18: Tipos de Ponto Eletrônico - Formatado e Documentado

/**
 * Tipos de registro de ponto
 */
export type TipoRegistro = 
  | 'entrada' 
  | 'saida_almoco' 
  | 'retorno_almoco' 
  | 'saida';

/**
 * Status do registro
 */
export type StatusRegistro = 
  | 'normal' 
  | 'ajustado' 
  | 'justificado' 
  | 'pendente';

/**
 * Registro individual de ponto
 */
export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  empresa_id?: string;
  
  // Dados do registro
  data: string;
  hora: string;
  tipo: TipoRegistro;
  status?: StatusRegistro;
  
  // Geolocalização
  latitude?: number;
  longitude?: number;
  endereco?: string;
  precisao_metros?: number;
  
  // Dispositivo
  foto_url?: string;
  ip?: string;
  dispositivo?: string;
  navegador?: string;
  
  // Justificativa (se ajustado)
  justificativa?: string;
  ajustado_por?: string;
  data_ajuste?: string;
  
  // Metadados
  created_at: string;
  updated_at?: string;
}

/**
 * Dia do espelho de ponto
 */
export interface DiaPonto {
  data: string;
  dia_semana: string;
  
  // Registros
  entrada?: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
  
  // Cálculos
  horas_trabalhadas: number;
  horas_extras: number;
  horas_extras_50?: number;
  horas_extras_100?: number;
  atraso: number;
  
  // Status
  falta: boolean;
  feriado?: boolean;
  folga?: boolean;
  compensado?: boolean;
  
  // Observações
  observacao?: string;
  tipo_ausencia?: 'falta' | 'atestado' | 'ferias' | 'licenca' | 'folga';
}

/**
 * Espelho de ponto mensal
 */
export interface EspelhoPonto {
  colaborador_id: string;
  colaborador_nome?: string;
  empresa_id?: string;
  competencia: string;
  
  // Dias
  dias: DiaPonto[];
  
  // Totais
  total_horas_trabalhadas: number;
  total_horas_extras: number;
  total_horas_extras_50: number;
  total_horas_extras_100: number;
  total_adicional_noturno: number;
  total_atrasos: number;
  total_faltas: number;
  total_dias_trabalhados: number;
  
  // Banco de horas
  banco_horas: number;
  saldo_banco_anterior: number;
  saldo_banco_atual: number;
  
  // Status
  fechado: boolean;
  data_fechamento?: string;
}

/**
 * Filtros para listagem de ponto
 */
export interface PontoFilters {
  colaborador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  tipo?: TipoRegistro;
  empresa_id?: string;
}

/**
 * Configuração de jornada
 */
export interface ConfiguracaoJornada {
  carga_horaria_diaria: number;
  entrada_padrao: string;
  saida_almoco_padrao: string;
  retorno_almoco_padrao: string;
  saida_padrao: string;
  tolerancia_minutos: number;
  banco_horas_ativo: boolean;
}

/**
 * Ajuste de ponto
 */
export interface AjustePonto {
  id: string;
  registro_id: string;
  colaborador_id: string;
  hora_original: string;
  hora_ajustada: string;
  motivo: string;
  aprovado: boolean;
  aprovador_id?: string;
  data_aprovacao?: string;
}
