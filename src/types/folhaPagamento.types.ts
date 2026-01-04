export interface FolhaPagamento {
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

export interface FolhaPagamentoCreate extends Omit<FolhaPagamento, "id" | "createdAt" | "updatedAt"> {}
export interface FolhaPagamentoUpdate extends Partial<Omit<FolhaPagamento, "id" | "createdAt">> {}
export interface FolhaPagamentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface FolhaPagamentoListResponse { data: FolhaPagamento[]; total: number; page: number; limit: number; totalPages: number; }
export type FolhaPagamentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
