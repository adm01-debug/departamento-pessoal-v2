// encargo.ts - Type definitions

export interface Encargo {
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

export interface EncargoCreate extends Omit<Encargo, "id" | "createdAt" | "updatedAt"> {}

export interface EncargoUpdate extends Partial<Omit<Encargo, "id" | "createdAt">> {}

export interface EncargoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface EncargoListResponse {
  data: Encargo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EncargoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isEncargo(obj: any): obj is Encargo {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
