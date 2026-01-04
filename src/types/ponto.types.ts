export interface Ponto {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface PontoCreate extends Omit<Ponto, "id" | "createdAt" | "updatedAt"> {}
export interface PontoUpdate extends Partial<PontoCreate> {}
export interface PontoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface PontoListResponse { data: Ponto[]; total: number; page: number; limit: number; }
export type PontoStatus = "ativo" | "inativo" | "pendente";
export default Ponto;
