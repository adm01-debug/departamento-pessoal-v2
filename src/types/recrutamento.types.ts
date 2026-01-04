export interface Recrutamento {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface RecrutamentoCreate extends Omit<Recrutamento, "id" | "createdAt" | "updatedAt"> {}
export interface RecrutamentoUpdate extends Partial<RecrutamentoCreate> {}
export interface RecrutamentoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface RecrutamentoListResponse { data: Recrutamento[]; total: number; page: number; limit: number; }
export type RecrutamentoStatus = "ativo" | "inativo" | "pendente";
export default Recrutamento;
