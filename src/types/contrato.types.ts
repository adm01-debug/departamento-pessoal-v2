export interface contratoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface contratoData extends contratoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface contratoCreate extends Omit<contratoData, "id" | "createdAt" | "updatedAt"> {}

export interface contratoUpdate extends Partial<contratoCreate> {
  id: string;
}

export interface contratoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof contratoData;
  sortOrder?: "asc" | "desc";
}

export interface contratoListResponse {
  data: contratoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface contratoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type contratoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const contratoStatusLabels: Record<contratoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function iscontratoData(obj: unknown): obj is contratoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
