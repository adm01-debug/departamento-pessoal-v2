// entities.ts - Type definitions

export interface Entities {
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

export interface EntitiesCreate extends Omit<Entities, "id" | "createdAt" | "updatedAt"> {}

export interface EntitiesUpdate extends Partial<Omit<Entities, "id" | "createdAt">> {}

export interface EntitiesFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface EntitiesListResponse {
  data: Entities[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EntitiesStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isEntities(obj: any): obj is Entities {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
