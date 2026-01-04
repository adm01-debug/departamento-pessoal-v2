export interface Convenio {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface ConvenioCreate extends Omit<Convenio, "id" | "createdAt" | "updatedAt"> {}
export interface ConvenioUpdate extends Partial<ConvenioCreate> {}
export interface ConvenioFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface ConvenioListResponse { data: Convenio[]; total: number; page: number; limit: number; }
export type ConvenioStatus = "ativo" | "inativo" | "pendente";
export default Convenio;
