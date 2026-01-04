export interface Documento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface DocumentoCreate extends Omit<Documento, "id" | "createdAt" | "updatedAt"> {}
export interface DocumentoUpdate extends Partial<DocumentoCreate> {}
export interface DocumentoFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface DocumentoListResponse { data: Documento[]; total: number; page: number; limit: number; }
export type DocumentoStatus = "ativo" | "inativo" | "pendente";
