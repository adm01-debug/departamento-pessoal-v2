export interface feriasBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface feriasData extends feriasBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface feriasCreate extends Omit<feriasData, "id" | "createdAt" | "updatedAt"> {}

export interface feriasUpdate extends Partial<feriasCreate> {
  id: string;
}

export interface feriasFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof feriasData;
  sortOrder?: "asc" | "desc";
}

export interface feriasListResponse {
  data: feriasData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface feriasStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type feriasStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const feriasStatusLabels: Record<feriasStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isferiasData(obj: unknown): obj is feriasData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
