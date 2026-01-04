export interface Empresa {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface EmpresaCreate extends Omit<Empresa, "id" | "createdAt" | "updatedAt"> {}
export interface EmpresaUpdate extends Partial<EmpresaCreate> {}
export interface EmpresaFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface EmpresaListResponse { data: Empresa[]; total: number; page: number; limit: number; }
export type EmpresaStatus = "ativo" | "inativo" | "pendente";
export default Empresa;
