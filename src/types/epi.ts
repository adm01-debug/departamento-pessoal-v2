// epi.ts - Type definitions

export interface Epi {
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

export interface EpiCreate extends Omit<Epi, "id" | "createdAt" | "updatedAt"> {}

export interface EpiUpdate extends Partial<Omit<Epi, "id" | "createdAt">> {}

export interface EpiFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface EpiListResponse {
  data: Epi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EpiStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isEpi(obj: any): obj is Epi {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
