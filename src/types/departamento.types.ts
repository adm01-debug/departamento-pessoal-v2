export interface Departamento {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface DepartamentoCreate extends Omit<Departamento, "id" | "createdAt" | "updatedAt"> {}
export interface DepartamentoUpdate extends Partial<DepartamentoCreate> {}
export interface DepartamentoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface DepartamentoListResponse { data: Departamento[]; total: number; page: number; limit: number; }
export type DepartamentoStatus = "ativo" | "inativo" | "pendente";
export default Departamento;
