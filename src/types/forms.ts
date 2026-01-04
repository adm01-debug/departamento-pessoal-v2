export interface Forms {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface FormsCreate extends Omit<Forms, "id" | "createdAt" | "updatedAt"> {}
export interface FormsUpdate extends Partial<FormsCreate> {}
export interface FormsFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface FormsListResponse { data: Forms[]; total: number; page: number; limit: number; }
export type FormsStatus = "ativo" | "inativo" | "pendente";
