export interface configuracaoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface configuracaoData extends configuracaoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface configuracaoCreate extends Omit<configuracaoData, "id" | "createdAt" | "updatedAt"> {}

export interface configuracaoUpdate extends Partial<configuracaoCreate> {
  id: string;
}

export interface configuracaoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof configuracaoData;
  sortOrder?: "asc" | "desc";
}

export interface configuracaoListResponse {
  data: configuracaoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface configuracaoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type configuracaoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const configuracaoStatusLabels: Record<configuracaoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isconfiguracaoData(obj: unknown): obj is configuracaoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
