export interface Documento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentoCreate extends Omit<Documento, "id" | "createdAt" | "updatedAt"> {}
export interface DocumentoUpdate extends Partial<Omit<Documento, "id" | "createdAt">> {}
export interface DocumentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface DocumentoListResponse { data: Documento[]; total: number; page: number; limit: number; totalPages: number; }
export type DocumentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
