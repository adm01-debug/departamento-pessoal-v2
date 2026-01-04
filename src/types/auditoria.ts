// auditoria.ts - Type definitions

export interface Auditoria {
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

export interface AuditoriaCreate extends Omit<Auditoria, "id" | "createdAt" | "updatedAt"> {}

export interface AuditoriaUpdate extends Partial<Omit<Auditoria, "id" | "createdAt">> {}

export interface AuditoriaFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface AuditoriaListResponse {
  data: Auditoria[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AuditoriaStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isAuditoria(obj: any): obj is Auditoria {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
