// aso.ts - Type definitions

export interface Aso {
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

export interface AsoCreate extends Omit<Aso, "id" | "createdAt" | "updatedAt"> {}

export interface AsoUpdate extends Partial<Omit<Aso, "id" | "createdAt">> {}

export interface AsoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface AsoListResponse {
  data: Aso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AsoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isAso(obj: any): obj is Aso {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
