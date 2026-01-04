export interface Avaliacao {
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

export interface AvaliacaoCreate extends Omit<Avaliacao, "id" | "createdAt" | "updatedAt"> {}
export interface AvaliacaoUpdate extends Partial<Omit<Avaliacao, "id" | "createdAt">> {}
export interface AvaliacaoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface AvaliacaoListResponse { data: Avaliacao[]; total: number; page: number; limit: number; totalPages: number; }
export type AvaliacaoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
