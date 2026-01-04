export interface relatorioBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface relatorioData extends relatorioBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface relatorioCreate extends Omit<relatorioData, "id" | "createdAt" | "updatedAt"> {}

export interface relatorioUpdate extends Partial<relatorioCreate> {
  id: string;
}

export interface relatorioFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof relatorioData;
  sortOrder?: "asc" | "desc";
}

export interface relatorioListResponse {
  data: relatorioData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface relatorioStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type relatorioStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const relatorioStatusLabels: Record<relatorioStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isrelatorioData(obj: unknown): obj is relatorioData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
