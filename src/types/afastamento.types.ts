export interface Afastamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface AfastamentoCreate extends Omit<Afastamento, "id" | "createdAt" | "updatedAt"> {}
export interface AfastamentoUpdate extends Partial<AfastamentoCreate> {}
export interface AfastamentoFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface AfastamentoListResponse { data: Afastamento[]; total: number; page: number; limit: number; }
export type AfastamentoStatus = "ativo" | "inativo" | "pendente";
