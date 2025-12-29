/**
 * @fileoverview Tipos para controle de ponto
 * @module types/ponto
 * @version V8.1 - Corrigido por análise QA
 */

// ============================================
// TIPOS BASE
// ============================================

export type TipoBatida = 'entrada1' | 'saida1' | 'entrada2' | 'saida2';
export type StatusPonto = 'aberto' | 'fechado' | 'pendente' | 'aprovado' | 'rejeitado';
export type TipoDia = 'util' | 'sabado' | 'domingo' | 'feriado' | 'folga';

// ============================================
// INTERFACES PRINCIPAIS
// ============================================

/**
 * Registro de ponto diário
 */
export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  empresa_id: string;
  data: string;
  
  // Batidas
  entrada1?: string;
  saida1?: string;
  entrada2?: string;
  saida2?: string;
  
  // Cálculos
  horas_trabalhadas?: string;
  horas_extras?: string;
  horas_falta?: string;
  banco_horas?: number;
  
  // Classificação
  tipo_dia: TipoDia;
  status: StatusPonto;
  
  // Metadados
  localizacao?: string;
  dispositivo?: string;
  ip?: string;
  observacoes?: string;
  
  // Aprovação
  aprovador_id?: string;
  data_aprovacao?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Relations
  colaborador?: {
    id: string;
    nome: string;
    cpf?: string;
    departamento_id?: string;
    jornada_trabalho?: string;
  };
}

/**
 * Filtros para listagem de ponto
 */
export interface PontoFilters {
  empresa_id?: string;
  colaborador_id?: string;
  departamento_id?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: StatusPonto;
  tipo_dia?: TipoDia;
}

/**
 * Resumo mensal de horas
 */
export interface ResumoMensal {
  colaboradorId: string;
  mes: number;
  ano: number;
  totalHoras: string;
  horasExtras: string;
  horasFalta: string;
  saldoBancoHoras: number;
  diasTrabalhados: number;
  diasFalta: number;
  atrasos: number;
  registros: RegistroPonto[];
}

/**
 * Banco de horas do colaborador
 */
export interface BancoHoras {
  colaborador_id: string;
  saldo_minutos: number;
  saldo_formatado: string;
  ultima_atualizacao: string;
  historico: BancoHorasMovimento[];
}

export interface BancoHorasMovimento {
  id: string;
  data: string;
  tipo: 'credito' | 'debito';
  minutos: number;
  motivo: string;
  registro_ponto_id?: string;
}

// ============================================
// ESPELHO DE PONTO
// ============================================

export interface EspelhoPonto {
  colaborador_id: string;
  colaborador_nome: string;
  mes: number;
  ano: number;
  dias: EspelhoDia[];
  totais: {
    horasTrabalhadas: string;
    horasExtras50: string;
    horasExtras100: string;
    horasNoturnas: string;
    horasFalta: string;
    atrasos: number;
    faltas: number;
  };
}

export interface EspelhoDia {
  data: string;
  diaSemana: string;
  tipoDia: TipoDia;
  entrada1?: string;
  saida1?: string;
  entrada2?: string;
  saida2?: string;
  horasTrabalhadas: string;
  horasExtras?: string;
  horasFalta?: string;
  observacao?: string;
  status: StatusPonto;
}

// ============================================
// JORNADA DE TRABALHO
// ============================================

export interface JornadaTrabalho {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'fixa' | 'flexivel' | 'escala';
  carga_semanal: number;
  tolerancia_minutos: number;
  horarios: HorarioJornada[];
}

export interface HorarioJornada {
  dia_semana: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  entrada: string;
  saida: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
  carga_diaria: number;
}

// ============================================
// LABELS
// ============================================

export const tipoBatidaLabels: Record<TipoBatida, string> = {
  entrada1: '1ª Entrada',
  saida1: '1ª Saída',
  entrada2: '2ª Entrada',
  saida2: '2ª Saída',
};

export const statusPontoLabels: Record<StatusPonto, string> = {
  aberto: 'Aberto',
  fechado: 'Fechado',
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

export const tipoDiaLabels: Record<TipoDia, string> = {
  util: 'Dia Útil',
  sabado: 'Sábado',
  domingo: 'Domingo',
  feriado: 'Feriado',
  folga: 'Folga',
};

export const diaSemanaLabels = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];
