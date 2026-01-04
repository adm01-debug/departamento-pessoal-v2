export interface Treinamento {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface TreinamentoCreate extends Omit<Treinamento, "id" | "createdAt" | "updatedAt"> {}
export interface TreinamentoUpdate extends Partial<TreinamentoCreate> {}
export interface TreinamentoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface TreinamentoListResponse { data: Treinamento[]; total: number; page: number; limit: number; }
export type TreinamentoStatus = "ativo" | "inativo" | "pendente";
export default Treinamento;
