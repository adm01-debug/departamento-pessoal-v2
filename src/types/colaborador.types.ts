export interface Colaborador {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface ColaboradorCreate extends Omit<Colaborador, "id" | "createdAt" | "updatedAt"> {}
export interface ColaboradorUpdate extends Partial<ColaboradorCreate> {}
export interface ColaboradorFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface ColaboradorListResponse { data: Colaborador[]; total: number; page: number; limit: number; }
export type ColaboradorStatus = "ativo" | "inativo" | "pendente";
export default Colaborador;
