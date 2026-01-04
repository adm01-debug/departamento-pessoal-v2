export interface Cargo {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface CargoCreate extends Omit<Cargo, "id" | "createdAt" | "updatedAt"> {}
export interface CargoUpdate extends Partial<CargoCreate> {}
export interface CargoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface CargoListResponse { data: Cargo[]; total: number; page: number; limit: number; }
export type CargoStatus = "ativo" | "inativo" | "pendente";
export default Cargo;
