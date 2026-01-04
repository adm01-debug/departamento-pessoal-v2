export interface Recrutamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface RecrutamentoCreate extends Omit<Recrutamento, "id" | "createdAt" | "updatedAt"> {}
export interface RecrutamentoUpdate extends Partial<RecrutamentoCreate> {}
export interface RecrutamentoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type RecrutamentoStatus = "ativo" | "inativo" | "pendente";
