// guia.ts - Type definitions

export interface Guia {
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

export interface GuiaCreate extends Omit<Guia, "id" | "createdAt" | "updatedAt"> {}

export interface GuiaUpdate extends Partial<Omit<Guia, "id" | "createdAt">> {}

export interface GuiaFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface GuiaListResponse {
  data: Guia[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type GuiaStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isGuia(obj: any): obj is Guia {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
