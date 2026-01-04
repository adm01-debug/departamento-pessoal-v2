export interface ValeTransporte {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ValeTransporteCreate extends Omit<ValeTransporte, "id" | "createdAt" | "updatedAt"> {}
export interface ValeTransporteUpdate extends Partial<ValeTransporteCreate> {}
export interface ValeTransporteFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ValeTransporteStatus = "ativo" | "inativo" | "pendente";
