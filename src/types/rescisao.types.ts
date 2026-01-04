export interface Rescisao {
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

export interface RescisaoCreate extends Omit<Rescisao, "id" | "createdAt" | "updatedAt"> {}
export interface RescisaoUpdate extends Partial<Omit<Rescisao, "id" | "createdAt">> {}
export interface RescisaoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface RescisaoListResponse { data: Rescisao[]; total: number; page: number; limit: number; totalPages: number; }
export type RescisaoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
