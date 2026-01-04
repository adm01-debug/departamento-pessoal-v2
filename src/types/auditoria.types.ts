export interface auditoriaBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface auditoriaData extends auditoriaBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface auditoriaCreate extends Omit<auditoriaData, "id" | "createdAt" | "updatedAt"> {}

export interface auditoriaUpdate extends Partial<auditoriaCreate> {
  id: string;
}

export interface auditoriaFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof auditoriaData;
  sortOrder?: "asc" | "desc";
}

export interface auditoriaListResponse {
  data: auditoriaData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface auditoriaStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type auditoriaStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const auditoriaStatusLabels: Record<auditoriaStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isauditoriaData(obj: unknown): obj is auditoriaData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
