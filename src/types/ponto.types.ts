export interface Ponto {
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

export interface PontoCreate extends Omit<Ponto, "id" | "createdAt" | "updatedAt"> {}
export interface PontoUpdate extends Partial<Omit<Ponto, "id" | "createdAt">> {}
export interface PontoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface PontoListResponse { data: Ponto[]; total: number; page: number; limit: number; totalPages: number; }
export type PontoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
