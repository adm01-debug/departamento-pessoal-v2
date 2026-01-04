export interface Routes {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface RoutesCreate extends Omit<Routes, "id" | "createdAt" | "updatedAt"> {}
export interface RoutesUpdate extends Partial<RoutesCreate> {}
export interface RoutesFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface RoutesListResponse { data: Routes[]; total: number; page: number; limit: number; }
export type RoutesStatus = "ativo" | "inativo" | "pendente";
