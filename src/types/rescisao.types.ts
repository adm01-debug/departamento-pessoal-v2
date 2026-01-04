export interface Rescisao {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface RescisaoCreate extends Omit<Rescisao, "id" | "createdAt" | "updatedAt"> {}
export interface RescisaoUpdate extends Partial<RescisaoCreate> {}
export interface RescisaoFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface RescisaoListResponse { data: Rescisao[]; total: number; page: number; limit: number; }
export type RescisaoStatus = "ativo" | "inativo" | "pendente";
export default Rescisao;
