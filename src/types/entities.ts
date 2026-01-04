export interface Entities {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface EntitiesCreate extends Omit<Entities, "id" | "createdAt" | "updatedAt"> {}
export interface EntitiesUpdate extends Partial<EntitiesCreate> {}
export interface EntitiesFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface EntitiesListResponse { data: Entities[]; total: number; page: number; limit: number; }
export type EntitiesStatus = "ativo" | "inativo" | "pendente";
