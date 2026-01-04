// forms.ts - Type definitions

export interface Forms {
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

export interface FormsCreate extends Omit<Forms, "id" | "createdAt" | "updatedAt"> {}

export interface FormsUpdate extends Partial<Omit<Forms, "id" | "createdAt">> {}

export interface FormsFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface FormsListResponse {
  data: Forms[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type FormsStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isForms(obj: any): obj is Forms {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
