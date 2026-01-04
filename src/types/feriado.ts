// feriado.ts - Type definitions

export interface Feriado {
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

export interface FeriadoCreate extends Omit<Feriado, "id" | "createdAt" | "updatedAt"> {}

export interface FeriadoUpdate extends Partial<Omit<Feriado, "id" | "createdAt">> {}

export interface FeriadoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface FeriadoListResponse {
  data: Feriado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type FeriadoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isFeriado(obj: any): obj is Feriado {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
