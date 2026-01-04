// notificacao.ts - Type definitions

export interface Notificacao {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificacaoCreate extends Omit<Notificacao, "id" | "createdAt" | "updatedAt"> {}

export interface NotificacaoUpdate extends Partial<Omit<Notificacao, "id" | "createdAt">> {}

export interface NotificacaoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface NotificacaoListResponse {
  data: Notificacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type NotificacaoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isNotificacao(obj: any): obj is Notificacao {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
