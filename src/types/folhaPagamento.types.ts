export interface FolhaPagamento {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface FolhaPagamentoCreate extends Omit<FolhaPagamento, "id" | "createdAt" | "updatedAt"> {}
export interface FolhaPagamentoUpdate extends Partial<FolhaPagamentoCreate> {}
export interface FolhaPagamentoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface FolhaPagamentoListResponse { data: FolhaPagamento[]; total: number; page: number; limit: number; }
export type FolhaPagamentoStatus = "ativo" | "inativo" | "pendente";
export default FolhaPagamento;
