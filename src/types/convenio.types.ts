export interface Convenio {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ConvenioCreate extends Omit<Convenio, "id" | "createdAt" | "updatedAt"> {}
export interface ConvenioUpdate extends Partial<ConvenioCreate> {}
export interface ConvenioFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface ConvenioListResponse { data: Convenio[]; total: number; page: number; limit: number; }
export type ConvenioStatus = "ativo" | "inativo" | "pendente";
