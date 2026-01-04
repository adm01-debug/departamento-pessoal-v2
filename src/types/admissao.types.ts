export interface admissaoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface admissaoData extends admissaoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface admissaoCreate extends Omit<admissaoData, "id" | "createdAt" | "updatedAt"> {}

export interface admissaoUpdate extends Partial<admissaoCreate> {
  id: string;
}

export interface admissaoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof admissaoData;
  sortOrder?: "asc" | "desc";
}

export interface admissaoListResponse {
  data: admissaoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface admissaoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type admissaoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const admissaoStatusLabels: Record<admissaoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isadmissaoData(obj: unknown): obj is admissaoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
