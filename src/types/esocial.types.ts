export interface esocialBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface esocialData extends esocialBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface esocialCreate extends Omit<esocialData, "id" | "createdAt" | "updatedAt"> {}

export interface esocialUpdate extends Partial<esocialCreate> {
  id: string;
}

export interface esocialFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof esocialData;
  sortOrder?: "asc" | "desc";
}

export interface esocialListResponse {
  data: esocialData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface esocialStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type esocialStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const esocialStatusLabels: Record<esocialStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isesocialData(obj: unknown): obj is esocialData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
