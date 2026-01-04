// routes.ts - Type definitions

export interface Routes {
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

export interface RoutesCreate extends Omit<Routes, "id" | "createdAt" | "updatedAt"> {}

export interface RoutesUpdate extends Partial<Omit<Routes, "id" | "createdAt">> {}

export interface RoutesFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface RoutesListResponse {
  data: Routes[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type RoutesStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isRoutes(obj: any): obj is Routes {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
