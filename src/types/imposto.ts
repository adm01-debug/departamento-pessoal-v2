// imposto.ts - Type definitions

export interface Imposto {
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

export interface ImpostoCreate extends Omit<Imposto, "id" | "createdAt" | "updatedAt"> {}

export interface ImpostoUpdate extends Partial<Omit<Imposto, "id" | "createdAt">> {}

export interface ImpostoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface ImpostoListResponse {
  data: Imposto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ImpostoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isImposto(obj: any): obj is Imposto {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
