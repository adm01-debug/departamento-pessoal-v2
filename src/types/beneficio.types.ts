export interface Beneficio {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface BeneficioCreate extends Omit<Beneficio, "id" | "createdAt" | "updatedAt"> {}
export interface BeneficioUpdate extends Partial<BeneficioCreate> {}
export interface BeneficioFilter { search?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface BeneficioListResponse { data: Beneficio[]; total: number; page: number; limit: number; }
export type BeneficioStatus = "ativo" | "inativo" | "pendente";
