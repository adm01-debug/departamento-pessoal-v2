export interface FolhaPagamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface FolhaPagamentoCreate extends Omit<FolhaPagamento, "id" | "createdAt" | "updatedAt"> {}
export interface FolhaPagamentoUpdate extends Partial<FolhaPagamentoCreate> {}
export interface FolhaPagamentoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type FolhaPagamentoStatus = "ativo" | "inativo" | "pendente";
