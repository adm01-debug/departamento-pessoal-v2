// escala.ts - Type definitions

export interface Escala {
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

export interface EscalaCreate extends Omit<Escala, "id" | "createdAt" | "updatedAt"> {}

export interface EscalaUpdate extends Partial<Omit<Escala, "id" | "createdAt">> {}

export interface EscalaFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface EscalaListResponse {
  data: Escala[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EscalaStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isEscala(obj: any): obj is Escala {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
