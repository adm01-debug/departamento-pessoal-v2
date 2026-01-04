export interface Afastamento {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface AfastamentoCreate extends Omit<Afastamento, "id" | "createdAt" | "updatedAt"> {}
export interface AfastamentoUpdate extends Partial<AfastamentoCreate> {}
export interface AfastamentoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface AfastamentoListResponse { data: Afastamento[]; total: number; page: number; limit: number; }
export type AfastamentoStatus = "ativo" | "inativo" | "pendente";
export default Afastamento;
