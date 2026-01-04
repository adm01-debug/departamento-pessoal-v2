export interface Seguro {
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

export interface SeguroCreate extends Omit<Seguro, "id" | "createdAt" | "updatedAt"> {}
export interface SeguroUpdate extends Partial<Omit<Seguro, "id" | "createdAt">> {}
export interface SeguroFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface SeguroListResponse { data: Seguro[]; total: number; page: number; limit: number; totalPages: number; }
export type SeguroStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
