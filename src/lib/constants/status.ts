/**
 * @fileoverview Constantes e enums para status do sistema
 * @module lib/constants/status
 */

/** Status do colaborador */
export const StatusColaborador = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  AFASTADO: 'afastado',
  FERIAS: 'ferias',
  DESLIGADO: 'desligado',
} as const;

export type StatusColaboradorType = typeof StatusColaborador[keyof typeof StatusColaborador];

/** Status das férias */
export const StatusFerias = {
  PROGRAMADA: 'programada',
  APROVADA: 'aprovada',
  EM_GOZO: 'em_gozo',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;

export type StatusFeriasType = typeof StatusFerias[keyof typeof StatusFerias];

/** Status do afastamento */
export const StatusAfastamento = {
  ATIVO: 'ativo',
  ENCERRADO: 'encerrado',
  PRORROGADO: 'prorrogado',
} as const;

export type StatusAfastamentoType = typeof StatusAfastamento[keyof typeof StatusAfastamento];

/** Status da admissão */
export const StatusAdmissao = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  DOCUMENTOS_PENDENTES: 'documentos_pendentes',
  APROVADA: 'aprovada',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;

export type StatusAdmissaoType = typeof StatusAdmissao[keyof typeof StatusAdmissao];

/** Status do evento eSocial */
export const StatusESocial = {
  PENDENTE: 'pendente',
  ENVIADO: 'enviado',
  PROCESSANDO: 'processando',
  ACEITO: 'aceito',
  REJEITADO: 'rejeitado',
  ERRO: 'erro',
} as const;

export type StatusESocialType = typeof StatusESocial[keyof typeof StatusESocial];

/** Status do documento */
export const StatusDocumento = {
  PENDENTE: 'pendente',
  ENVIADO: 'enviado',
  APROVADO: 'aprovado',
  REJEITADO: 'rejeitado',
  EXPIRADO: 'expirado',
} as const;

export type StatusDocumentoType = typeof StatusDocumento[keyof typeof StatusDocumento];

/** Status da assinatura digital */
export const StatusAssinatura = {
  PENDENTE: 'pendente',
  ASSINADO: 'assinado',
  REJEITADO: 'rejeitado',
  EXPIRADO: 'expirado',
} as const;

export type StatusAssinaturaType = typeof StatusAssinatura[keyof typeof StatusAssinatura];

/** Cores para cada status (Tailwind classes) */
export const StatusColors: Record<string, string> = {
  // Colaborador
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-gray-100 text-gray-800',
  afastado: 'bg-yellow-100 text-yellow-800',
  ferias: 'bg-blue-100 text-blue-800',
  desligado: 'bg-red-100 text-red-800',
  // Férias
  programada: 'bg-blue-100 text-blue-800',
  aprovada: 'bg-green-100 text-green-800',
  em_gozo: 'bg-purple-100 text-purple-800',
  concluida: 'bg-gray-100 text-gray-800',
  cancelada: 'bg-red-100 text-red-800',
  // Genéricos
  pendente: 'bg-yellow-100 text-yellow-800',
  enviado: 'bg-blue-100 text-blue-800',
  processando: 'bg-purple-100 text-purple-800',
  aceito: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
  erro: 'bg-red-100 text-red-800',
  expirado: 'bg-orange-100 text-orange-800',
  assinado: 'bg-green-100 text-green-800',
};

/** Labels em português para status */
export const StatusLabels: Record<string, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  afastado: 'Afastado',
  ferias: 'Em Férias',
  desligado: 'Desligado',
  programada: 'Programada',
  aprovada: 'Aprovada',
  em_gozo: 'Em Gozo',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  pendente: 'Pendente',
  enviado: 'Enviado',
  processando: 'Processando',
  aceito: 'Aceito',
  rejeitado: 'Rejeitado',
  erro: 'Erro',
  expirado: 'Expirado',
  assinado: 'Assinado',
  em_andamento: 'Em Andamento',
  documentos_pendentes: 'Documentos Pendentes',
};
