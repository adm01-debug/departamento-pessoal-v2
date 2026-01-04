export interface Colaborador {
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

export interface ColaboradorCreate extends Omit<Colaborador, "id" | "createdAt" | "updatedAt"> {}
export interface ColaboradorUpdate extends Partial<Omit<Colaborador, "id" | "createdAt">> {}
export interface ColaboradorFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface ColaboradorListResponse { data: Colaborador[]; total: number; page: number; limit: number; totalPages: number; }
export type ColaboradorStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
