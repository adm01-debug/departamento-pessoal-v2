export interface dependenteBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface dependenteData extends dependenteBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface dependenteCreate extends Omit<dependenteData, "id" | "createdAt" | "updatedAt"> {}

export interface dependenteUpdate extends Partial<dependenteCreate> {
  id: string;
}

export interface dependenteFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof dependenteData;
  sortOrder?: "asc" | "desc";
}

export interface dependenteListResponse {
  data: dependenteData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface dependenteStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type dependenteStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const dependenteStatusLabels: Record<dependenteStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isdependenteData(obj: unknown): obj is dependenteData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
