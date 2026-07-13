/**
 * @fileoverview Constantes canônicas de status/tipo — fonte única de verdade
 * espelhando os CHECK constraints aplicados no banco de dados (Melhoria #19).
 *
 * IMPORTANTE: Qualquer alteração nestes valores DEVE ser acompanhada de migração
 * SQL correspondente atualizando o CHECK constraint da tabela relacionada.
 * Caso contrário, INSERTs/UPDATEs falharão com `23514 check_violation`.
 *
 * @module constants/workflow-status
 */

// ============================================================================
// FÉRIAS
// ============================================================================
export const FERIAS_STATUS = [
  'solicitada',
  'em_analise',
  'aprovada',
  'rejeitada',
  'cancelada',
  'agendada',
  'em_gozo',
  'concluida',
  'pendente_aprovacao',
  'vencida',
] as const;
export type FeriasStatus = (typeof FERIAS_STATUS)[number];

export const FERIAS_STATUS_LABELS: Record<FeriasStatus, string> = {
  solicitada: 'Solicitada',
  em_analise: 'Em Análise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  cancelada: 'Cancelada',
  agendada: 'Agendada',
  em_gozo: 'Em Gozo',
  concluida: 'Concluída',
  pendente_aprovacao: 'Pendente Aprovação',
  vencida: 'Vencida',
};

// ============================================================================
// CICLOS DE AVALIAÇÃO
// ============================================================================
export const CICLO_AVALIACAO_STATUS = [
  'rascunho',
  'ativo',
  'em_andamento',
  'concluido',
  'cancelado',
  'arquivado',
] as const;
export type CicloAvaliacaoStatus = (typeof CICLO_AVALIACAO_STATUS)[number];

export const CICLO_AVALIACAO_TIPO = [
  'desempenho',
  '360',
  'competencias',
  'okr',
  'pdi',
  'experiencia',
  'anual',
  'semestral',
  'trimestral',
] as const;
export type CicloAvaliacaoTipo = (typeof CICLO_AVALIACAO_TIPO)[number];

// ============================================================================
// DESLIGAMENTOS
// ============================================================================
export const DESLIGAMENTO_STATUS = [
  'rascunho',
  'em_andamento',
  'aprovado',
  'rejeitado',
  'concluido',
  'cancelado',
  'homologado',
] as const;
export type DesligamentoStatus = (typeof DESLIGAMENTO_STATUS)[number];

export const DESLIGAMENTO_ETAPA = [
  'iniciado',
  'comunicacao',
  'documentacao',
  'calculo_rescisao',
  'pagamento',
  'homologacao',
  'esocial',
  'devolucao_equipamentos',
  'revogacao_acessos',
  'concluido',
] as const;
export type DesligamentoEtapa = (typeof DESLIGAMENTO_ETAPA)[number];

// ============================================================================
// FALTAS
// ============================================================================
export const FALTA_STATUS = [
  'pendente',
  'justificada',
  'abonada',
  'injustificada',
  'em_analise',
  'rejeitada',
] as const;
export type FaltaStatus = (typeof FALTA_STATUS)[number];

export const FALTA_TIPO = [
  'atestado_medico',
  'falta_injustificada',
  'falta_justificada',
  'licenca',
  'ausencia_parcial',
  'atraso',
  'saida_antecipada',
  'luto',
  'casamento',
  'doacao_sangue',
  'servico_militar',
  'doenca_familiar',
  'maternidade',
  'paternidade',
  'outros',
] as const;
export type FaltaTipo = (typeof FALTA_TIPO)[number];

// ============================================================================
// FOLHA DE PAGAMENTO
// ============================================================================
export const FOLHA_TIPO = [
  'mensal',
  '13_primeira',
  '13_segunda',
  'ferias',
  'rescisao',
  'adiantamento',
  'complementar',
  'pro_labore',
] as const;
export type FolhaTipo = (typeof FOLHA_TIPO)[number];

// ============================================================================
// NOTIFICAÇÕES
// ============================================================================
export const NOTIFICACAO_TIPO = [
  'info',
  'sucesso',
  'aviso',
  'erro',
  'sistema',
  'ponto',
  'ferias',
  'folha',
  'beneficio',
  'documento',
  'avaliacao',
  'treinamento',
  'admissao',
  'desligamento',
] as const;
export type NotificacaoTipo = (typeof NOTIFICACAO_TIPO)[number];

// ============================================================================
// PDI (Plano de Desenvolvimento Individual)
// ============================================================================
export const PDI_STATUS = [
  'rascunho',
  'ativo',
  'em_andamento',
  'pausado',
  'concluido',
  'cancelado',
  'vencido',
] as const;
export type PdiStatus = (typeof PDI_STATUS)[number];

// ============================================================================
// PESQUISAS (Clima, Engajamento, eNPS, etc.)
// ============================================================================
export const PESQUISA_STATUS = [
  'rascunho',
  'ativa',
  'encerrada',
  'arquivada',
  'cancelada',
] as const;
export type PesquisaStatus = (typeof PESQUISA_STATUS)[number];

export const PESQUISA_TIPO = [
  'clima',
  'engajamento',
  'enps',
  'pulse',
  'saida',
  'onboarding',
  '360',
  'ad_hoc',
] as const;
export type PesquisaTipo = (typeof PESQUISA_TIPO)[number];

// ============================================================================
// SOLICITAÇÕES DE AJUSTE DE PONTO
// ============================================================================
export const AJUSTE_PONTO_STATUS = [
  'pendente',
  'em_analise',
  'aprovada',
  'rejeitada',
  'cancelada',
  'estornada',
] as const;
export type AjustePontoStatus = (typeof AJUSTE_PONTO_STATUS)[number];

// ============================================================================
// VAGAS (Recrutamento)
// ============================================================================
export const VAGA_STATUS = [
  'rascunho',
  'aberta',
  'pausada',
  'encerrada',
  'preenchida',
  'cancelada',
  'arquivada',
] as const;
export type VagaStatus = (typeof VAGA_STATUS)[number];

// ============================================================================
// HELPERS — Type Guards
// ============================================================================

/**
 * Guarda de tipo genérica para validar se um valor pertence a uma tupla `as const`.
 * Útil para narrowing seguro ao ler dados do banco ou de APIs externas.
 *
 * @example
 * if (isValidStatus(row.status, FERIAS_STATUS)) {
 *   // row.status agora é FeriasStatus
 * }
 */
export function isValidStatus<T extends readonly string[]>(
  value: unknown,
  allowedValues: T
): value is T[number] {
  return typeof value === 'string' && (allowedValues as readonly string[]).includes(value);
}

/**
 * Retorna o label formatado para exibição na UI, com fallback para o valor bruto
 * caso não haja tradução mapeada (mantém observabilidade em vez de retornar vazio).
 */
export function getStatusLabel<K extends string>(
  status: K,
  labels: Partial<Record<K, string>>
): string {
  return labels[status] ?? status;
}
