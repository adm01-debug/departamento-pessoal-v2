export interface Empresa {
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

export interface EmpresaCreate extends Omit<Empresa, "id" | "createdAt" | "updatedAt"> {}
export interface EmpresaUpdate extends Partial<Omit<Empresa, "id" | "createdAt">> {}
export interface EmpresaFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface EmpresaListResponse { data: Empresa[]; total: number; page: number; limit: number; totalPages: number; }
export type EmpresaStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
