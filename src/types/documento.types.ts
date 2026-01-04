export interface documentoBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface documentoData extends documentoBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface documentoCreate extends Omit<documentoData, "id" | "createdAt" | "updatedAt"> {}

export interface documentoUpdate extends Partial<documentoCreate> {
  id: string;
}

export interface documentoFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof documentoData;
  sortOrder?: "asc" | "desc";
}

export interface documentoListResponse {
  data: documentoData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface documentoStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type documentoStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const documentoStatusLabels: Record<documentoStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isdocumentoData(obj: unknown): obj is documentoData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
