export interface Ferias {
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

export interface FeriasCreate extends Omit<Ferias, "id" | "createdAt" | "updatedAt"> {}
export interface FeriasUpdate extends Partial<Omit<Ferias, "id" | "createdAt">> {}
export interface FeriasFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface FeriasListResponse { data: Ferias[]; total: number; page: number; limit: number; totalPages: number; }
export type FeriasStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
