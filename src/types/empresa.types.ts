export interface empresaBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface empresaData extends empresaBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface empresaCreate extends Omit<empresaData, "id" | "createdAt" | "updatedAt"> {}

export interface empresaUpdate extends Partial<empresaCreate> {
  id: string;
}

export interface empresaFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof empresaData;
  sortOrder?: "asc" | "desc";
}

export interface empresaListResponse {
  data: empresaData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface empresaStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type empresaStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const empresaStatusLabels: Record<empresaStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isempresaData(obj: unknown): obj is empresaData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
