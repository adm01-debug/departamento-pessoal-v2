export interface beneficioBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface beneficioData extends beneficioBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface beneficioCreate extends Omit<beneficioData, "id" | "createdAt" | "updatedAt"> {}

export interface beneficioUpdate extends Partial<beneficioCreate> {
  id: string;
}

export interface beneficioFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof beneficioData;
  sortOrder?: "asc" | "desc";
}

export interface beneficioListResponse {
  data: beneficioData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface beneficioStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type beneficioStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const beneficioStatusLabels: Record<beneficioStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isbeneficioData(obj: unknown): obj is beneficioData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
