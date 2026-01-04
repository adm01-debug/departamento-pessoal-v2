export interface ValeTransporte {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface ValeTransporteCreate extends Omit<ValeTransporte, "id" | "createdAt" | "updatedAt"> {}
export interface ValeTransporteUpdate extends Partial<ValeTransporteCreate> {}
export interface ValeTransporteFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface ValeTransporteListResponse { data: ValeTransporte[]; total: number; page: number; limit: number; }
export type ValeTransporteStatus = "ativo" | "inativo" | "pendente";
export default ValeTransporte;
