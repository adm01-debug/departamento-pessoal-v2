export interface cargoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface cargoData extends cargoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface cargoCreate extends Omit<cargoData, "id" | "createdAt" | "updatedAt"> {}

export interface cargoUpdate extends Partial<cargoCreate> {
  id: string;
}

export interface cargoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof cargoData;
  sortOrder?: "asc" | "desc";
}

export interface cargoListResponse {
  data: cargoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface cargoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type cargoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const cargoStatusLabels: Record<cargoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function iscargoData(obj: unknown): obj is cargoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
