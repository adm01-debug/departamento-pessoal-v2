// turno.ts - Type definitions

export interface Turno {
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

export interface TurnoCreate extends Omit<Turno, "id" | "createdAt" | "updatedAt"> {}

export interface TurnoUpdate extends Partial<Omit<Turno, "id" | "createdAt">> {}

export interface TurnoFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface TurnoListResponse {
  data: Turno[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TurnoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isTurno(obj: any): obj is Turno {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
