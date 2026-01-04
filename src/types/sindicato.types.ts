export interface Sindicato {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface SindicatoCreate extends Omit<Sindicato, "id" | "createdAt" | "updatedAt"> {}
export interface SindicatoUpdate extends Partial<SindicatoCreate> {}
export interface SindicatoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface SindicatoListResponse { data: Sindicato[]; total: number; page: number; limit: number; }
export type SindicatoStatus = "ativo" | "inativo" | "pendente";
export default Sindicato;
