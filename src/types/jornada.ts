// jornada.ts - Type definitions

export interface Jornada {
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

export interface JornadaCreate extends Omit<Jornada, "id" | "createdAt" | "updatedAt"> {}

export interface JornadaUpdate extends Partial<Omit<Jornada, "id" | "createdAt">> {}

export interface JornadaFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface JornadaListResponse {
  data: Jornada[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type JornadaStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isJornada(obj: any): obj is Jornada {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
