/**
 * @fileoverview Constantes do sistema
 * @module lib/constants
 */
// Status do Colaborador
export const StatusColaborador = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  FERIAS: 'ferias',
  AFASTADO: 'afastado',
  DESLIGADO: 'desligado',
} as const;

export type StatusColaboradorType = typeof StatusColaborador[keyof typeof StatusColaborador];

// Status de Férias
export const StatusFerias = {
  PROGRAMADA: 'programada',
  APROVADA: 'aprovada',
  EM_GOZO: 'em_gozo',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;

export type StatusFeriasType = typeof StatusFerias[keyof typeof StatusFerias];

// Status de Afastamento
export const StatusAfastamento = {
  ATIVO: 'ativo',
  ENCERRADO: 'encerrado',
  PENDENTE: 'pendente',
} as const;

export type StatusAfastamentoType = typeof StatusAfastamento[keyof typeof StatusAfastamento];

// Status de Admissão
export const StatusAdmissao = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;

export type StatusAdmissaoType = typeof StatusAdmissao[keyof typeof StatusAdmissao];

// Cores de Status
export const StatusColors: Record<string, string> = {
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-red-100 text-red-800',
  ferias: 'bg-blue-100 text-blue-800',
  afastado: 'bg-yellow-100 text-yellow-800',
  desligado: 'bg-gray-100 text-gray-800',
  programada: 'bg-blue-100 text-blue-800',
  aprovada: 'bg-green-100 text-green-800',
  em_gozo: 'bg-purple-100 text-purple-800',
  concluida: 'bg-gray-100 text-gray-800',
  cancelada: 'bg-red-100 text-red-800',
  pendente: 'bg-yellow-100 text-yellow-800',
  em_andamento: 'bg-blue-100 text-blue-800',
};

// Timeouts padrão (ms)
export const TIMEOUTS = {
  DEBOUNCE: 300,
  THROTTLE: 500,
  ANIMATION: 200,
  TOAST: 5000,
  API_RETRY: 1000,
} as const;

// Limites de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Intervalos de cache (ms)
export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutos
  GC_TIME: 30 * 60 * 1000, // 30 minutos
} as const;
