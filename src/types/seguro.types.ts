export interface Seguro {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface SeguroCreate extends Omit<Seguro, "id" | "createdAt" | "updatedAt"> {}
export interface SeguroUpdate extends Partial<SeguroCreate> {}
export interface SeguroFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface SeguroListResponse { data: Seguro[]; total: number; page: number; limit: number; }
export type SeguroStatus = "ativo" | "inativo" | "pendente";
export default Seguro;
