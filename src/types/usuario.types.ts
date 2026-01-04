export interface usuarioBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface usuarioData extends usuarioBase {
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  metadata?: Record<string, unknown>;
}

export interface usuarioCreate extends Omit<usuarioData, "id" | "createdAt" | "updatedAt"> {}

export interface usuarioUpdate extends Partial<usuarioCreate> {
  id: string;
}

export interface usuarioFilter {
  id?: string;
  nome?: string;
  ativo?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof usuarioData;
  sortOrder?: "asc" | "desc";
}

export interface usuarioListResponse {
  data: usuarioData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface usuarioStats {
  total: number;
  ativos: number;
  inativos: number;
  criadosHoje: number;
  criadosSemana: number;
  criadosMes: number;
}

export type usuarioStatus = "ativo" | "inativo" | "pendente" | "arquivado";

export const usuarioStatusLabels: Record<usuarioStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  arquivado: "Arquivado",
};

export function isusuarioData(obj: unknown): obj is usuarioData {
  return typeof obj === "object" && obj !== null && "id" in obj && "nome" in obj;
}
