export interface integracaoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface integracaoData extends integracaoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface integracaoCreate extends Omit<integracaoData, "id" | "createdAt" | "updatedAt"> {}

export interface integracaoUpdate extends Partial<integracaoCreate> {
  id: string;
}

export interface integracaoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof integracaoData;
  sortOrder?: "asc" | "desc";
}

export interface integracaoListResponse {
  data: integracaoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface integracaoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type integracaoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const integracaoStatusLabels: Record<integracaoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isintegracaoData(obj: unknown): obj is integracaoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
