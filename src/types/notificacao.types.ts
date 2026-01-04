export interface notificacaoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface notificacaoData extends notificacaoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface notificacaoCreate extends Omit<notificacaoData, "id" | "createdAt" | "updatedAt"> {}

export interface notificacaoUpdate extends Partial<notificacaoCreate> {
  id: string;
}

export interface notificacaoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof notificacaoData;
  sortOrder?: "asc" | "desc";
}

export interface notificacaoListResponse {
  data: notificacaoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface notificacaoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type notificacaoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const notificacaoStatusLabels: Record<notificacaoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isnotificacaoData(obj: unknown): obj is notificacaoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
