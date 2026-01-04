// exame.ts - Type definitions

export interface Exame {
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

export interface ExameCreate extends Omit<Exame, "id" | "createdAt" | "updatedAt"> {}

export interface ExameUpdate extends Partial<Omit<Exame, "id" | "createdAt">> {}

export interface ExameFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface ExameListResponse {
  data: Exame[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ExameStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isExame(obj: any): obj is Exame {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
