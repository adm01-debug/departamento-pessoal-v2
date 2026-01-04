export interface Afastamento {
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

export interface AfastamentoCreate extends Omit<Afastamento, "id" | "createdAt" | "updatedAt"> {}
export interface AfastamentoUpdate extends Partial<Omit<Afastamento, "id" | "createdAt">> {}
export interface AfastamentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface AfastamentoListResponse { data: Afastamento[]; total: number; page: number; limit: number; totalPages: number; }
export type AfastamentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
