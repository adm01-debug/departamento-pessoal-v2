export interface Convenio {
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

export interface ConvenioCreate extends Omit<Convenio, "id" | "createdAt" | "updatedAt"> {}
export interface ConvenioUpdate extends Partial<Omit<Convenio, "id" | "createdAt">> {}
export interface ConvenioFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface ConvenioListResponse { data: Convenio[]; total: number; page: number; limit: number; totalPages: number; }
export type ConvenioStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
