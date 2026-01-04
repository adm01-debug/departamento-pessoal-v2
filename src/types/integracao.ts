// integracao.ts - Type definitions

export interface Integracao {
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

export interface IntegracaoCreate extends Omit<Integracao, "id" | "createdAt" | "updatedAt"> {}

export interface IntegracaoUpdate extends Partial<Omit<Integracao, "id" | "createdAt">> {}

export interface IntegracaoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface IntegracaoListResponse {
  data: Integracao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type IntegracaoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isIntegracao(obj: any): obj is Integracao {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
