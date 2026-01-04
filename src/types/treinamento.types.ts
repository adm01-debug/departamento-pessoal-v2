export interface Treinamento {
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

export interface TreinamentoCreate extends Omit<Treinamento, "id" | "createdAt" | "updatedAt"> {}
export interface TreinamentoUpdate extends Partial<Omit<Treinamento, "id" | "createdAt">> {}
export interface TreinamentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface TreinamentoListResponse { data: Treinamento[]; total: number; page: number; limit: number; totalPages: number; }
export type TreinamentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
