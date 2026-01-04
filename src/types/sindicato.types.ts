export interface Sindicato {
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

export interface SindicatoCreate extends Omit<Sindicato, "id" | "createdAt" | "updatedAt"> {}
export interface SindicatoUpdate extends Partial<Omit<Sindicato, "id" | "createdAt">> {}
export interface SindicatoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface SindicatoListResponse { data: Sindicato[]; total: number; page: number; limit: number; totalPages: number; }
export type SindicatoStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
