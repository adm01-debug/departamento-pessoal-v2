/**
 * @fileoverview Tipos para notificações
 * @module types/notificacao
 */
export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  lida: boolean;
  usuario_id: string;
  link?: string;
  acao?: string;
  dados_extras?: Record<string, unknown>;
  created_at: string;
  read_at?: string;
}

export interface NotificacaoFormData extends Omit<Notificacao, 'id' | 'created_at' | 'lida' | 'read_at'> {}

export interface NotificacaoFilters {
  usuario_id?: string;
  tipo?: Notificacao['tipo'];
  lida?: boolean;
}

export const TIPOS_NOTIFICACAO: Record<Notificacao['tipo'], { label: string; cor: string }> = {
  info: { label: 'Informação', cor: 'blue' },
  warning: { label: 'Atenção', cor: 'yellow' },
  error: { label: 'Erro', cor: 'red' },
  success: { label: 'Sucesso', cor: 'green' },
};
