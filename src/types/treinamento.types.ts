export interface Treinamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface TreinamentoCreate extends Omit<Treinamento, "id" | "createdAt" | "updatedAt"> {}
export interface TreinamentoUpdate extends Partial<TreinamentoCreate> {}
export interface TreinamentoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type TreinamentoStatus = "ativo" | "inativo" | "pendente";
