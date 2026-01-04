export interface demissaoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface demissaoData extends demissaoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface demissaoCreate extends Omit<demissaoData, "id" | "createdAt" | "updatedAt"> {}

export interface demissaoUpdate extends Partial<demissaoCreate> {
  id: string;
}

export interface demissaoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof demissaoData;
  sortOrder?: "asc" | "desc";
}

export interface demissaoListResponse {
  data: demissaoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface demissaoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type demissaoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const demissaoStatusLabels: Record<demissaoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isdemissaoData(obj: unknown): obj is demissaoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
