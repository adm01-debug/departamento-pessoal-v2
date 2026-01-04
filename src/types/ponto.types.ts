export interface pontoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface pontoData extends pontoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface pontoCreate extends Omit<pontoData, "id" | "createdAt" | "updatedAt"> {}

export interface pontoUpdate extends Partial<pontoCreate> {
  id: string;
}

export interface pontoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof pontoData;
  sortOrder?: "asc" | "desc";
}

export interface pontoListResponse {
  data: pontoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface pontoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type pontoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const pontoStatusLabels: Record<pontoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function ispontoData(obj: unknown): obj is pontoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
