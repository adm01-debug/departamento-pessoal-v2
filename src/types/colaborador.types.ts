export interface Colaborador {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ColaboradorCreate extends Omit<Colaborador, "id" | "createdAt" | "updatedAt"> {}
export interface ColaboradorUpdate extends Partial<ColaboradorCreate> {}
export interface ColaboradorFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface ColaboradorListResponse { data: Colaborador[]; total: number; page: number; limit: number; }
export type ColaboradorStatus = "ativo" | "inativo" | "pendente";
