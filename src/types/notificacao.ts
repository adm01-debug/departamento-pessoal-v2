export interface Notificacao {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface NotificacaoCreate extends Omit<Notificacao, "id" | "createdAt" | "updatedAt"> {}
export interface NotificacaoUpdate extends Partial<NotificacaoCreate> {}
export interface NotificacaoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type NotificacaoStatus = "ativo" | "inativo" | "pendente";
