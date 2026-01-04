export interface Departamento {
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

export interface DepartamentoCreate extends Omit<Departamento, "id" | "createdAt" | "updatedAt"> {}
export interface DepartamentoUpdate extends Partial<Omit<Departamento, "id" | "createdAt">> {}
export interface DepartamentoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface DepartamentoListResponse { data: Departamento[]; total: number; page: number; limit: number; totalPages: number; }
export type DepartamentoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
