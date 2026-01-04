// recibo.ts - Type definitions

export interface Recibo {
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

export interface ReciboCreate extends Omit<Recibo, "id" | "createdAt" | "updatedAt"> {}

export interface ReciboUpdate extends Partial<Omit<Recibo, "id" | "createdAt">> {}

export interface ReciboFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface ReciboListResponse {
  data: Recibo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ReciboStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isRecibo(obj: any): obj is Recibo {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
