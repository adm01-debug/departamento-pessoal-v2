export interface Recrutamento {
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

export interface RecrutamentoCreate extends Omit<Recrutamento, "id" | "createdAt" | "updatedAt"> {}
export interface RecrutamentoUpdate extends Partial<Omit<Recrutamento, "id" | "createdAt">> {}
export interface RecrutamentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface RecrutamentoListResponse { data: Recrutamento[]; total: number; page: number; limit: number; totalPages: number; }
export type RecrutamentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
