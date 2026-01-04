export interface Ferias {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface FeriasCreate extends Omit<Ferias, "id" | "createdAt" | "updatedAt"> {}
export interface FeriasUpdate extends Partial<FeriasCreate> {}
export interface FeriasFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface FeriasListResponse { data: Ferias[]; total: number; page: number; limit: number; }
export type FeriasStatus = "ativo" | "inativo" | "pendente";
export default Ferias;
