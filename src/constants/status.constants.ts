// V17.2-C003: Constantes de Status
export const STATUS_COLABORADOR = {
  ATIVO: 'ativo',
  AFASTADO: 'afastado',
  FERIAS: 'ferias',
  DESLIGADO: 'desligado',
  PENDENTE: 'pendente',
} as const;
export const STATUS_FOLHA = {
  ABERTA: 'aberta',
  PROCESSANDO: 'processando',
  PROCESSADA: 'processada',
  FECHADA: 'fechada',
  CANCELADA: 'cancelada',
} as const;
export const STATUS_FERIAS = {
  PROGRAMADA: 'programada',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;
export const STATUS_ADMISSAO = {
  RASCUNHO: 'rascunho',
  DOCUMENTOS_PENDENTES: 'documentos_pendentes',
  AGUARDANDO_APROVACAO: 'aguardando_aprovacao',
  APROVADA: 'aprovada',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;
export const STATUS_ESOCIAL = {
  PENDENTE: 'pendente',
  VALIDADO: 'validado',
  ENVIADO: 'enviado',
  PROCESSADO: 'processado',
  ERRO: 'erro',
  REJEITADO: 'rejeitado',
} as const;
