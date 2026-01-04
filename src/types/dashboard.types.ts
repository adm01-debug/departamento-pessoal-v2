export interface dashboardBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface dashboardData extends dashboardBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface dashboardCreate extends Omit<dashboardData, "id" | "createdAt" | "updatedAt"> {}

export interface dashboardUpdate extends Partial<dashboardCreate> {
  id: string;
}

export interface dashboardFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof dashboardData;
  sortOrder?: "asc" | "desc";
}

export interface dashboardListResponse {
  data: dashboardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface dashboardStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type dashboardStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const dashboardStatusLabels: Record<dashboardStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isdashboardData(obj: unknown): obj is dashboardData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
