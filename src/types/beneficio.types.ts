export interface Beneficio {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BeneficioCreate extends Omit<Beneficio, "id" | "createdAt" | "updatedAt"> {}
export interface BeneficioUpdate extends Partial<Omit<Beneficio, "id" | "createdAt">> {}
export interface BeneficioFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface BeneficioListResponse { data: Beneficio[]; total: number; page: number; limit: number; totalPages: number; }
export type BeneficioStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
