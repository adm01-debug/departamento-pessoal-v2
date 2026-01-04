// cargo.ts - Type definitions

export interface Cargo {
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

export interface CargoCreate extends Omit<Cargo, "id" | "createdAt" | "updatedAt"> {}

export interface CargoUpdate extends Partial<Omit<Cargo, "id" | "createdAt">> {}

export interface CargoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface CargoListResponse {
  data: Cargo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CargoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isCargo(obj: any): obj is Cargo {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
