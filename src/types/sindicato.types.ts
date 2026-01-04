export interface Sindicato {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface SindicatoCreate extends Omit<Sindicato, "id" | "createdAt" | "updatedAt"> {}
export interface SindicatoUpdate extends Partial<SindicatoCreate> {}
export interface SindicatoFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface SindicatoListResponse { data: Sindicato[]; total: number; page: number; limit: number; }
export type SindicatoStatus = "ativo" | "inativo" | "pendente";
