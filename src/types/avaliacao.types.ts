export interface Avaliacao {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface AvaliacaoCreate extends Omit<Avaliacao, "id" | "createdAt" | "updatedAt"> {}
export interface AvaliacaoUpdate extends Partial<AvaliacaoCreate> {}
export interface AvaliacaoFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface AvaliacaoListResponse { data: Avaliacao[]; total: number; page: number; limit: number; }
export type AvaliacaoStatus = "ativo" | "inativo" | "pendente";
