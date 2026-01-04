export interface folhaBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface folhaData extends folhaBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface folhaCreate extends Omit<folhaData, "id" | "createdAt" | "updatedAt"> {}

export interface folhaUpdate extends Partial<folhaCreate> {
  id: string;
}

export interface folhaFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof folhaData;
  sortOrder?: "asc" | "desc";
}

export interface folhaListResponse {
  data: folhaData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface folhaStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type folhaStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const folhaStatusLabels: Record<folhaStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isfolhaData(obj: unknown): obj is folhaData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
