export interface departamentoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface departamentoData extends departamentoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface departamentoCreate extends Omit<departamentoData, "id" | "createdAt" | "updatedAt"> {}

export interface departamentoUpdate extends Partial<departamentoCreate> {
  id: string;
}

export interface departamentoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof departamentoData;
  sortOrder?: "asc" | "desc";
}

export interface departamentoListResponse {
  data: departamentoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface departamentoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type departamentoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const departamentoStatusLabels: Record<departamentoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isdepartamentoData(obj: unknown): obj is departamentoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
