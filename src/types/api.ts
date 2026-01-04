export interface Api {
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
export interface ApiCreate extends Omit<Api, "id" | "createdAt" | "updatedAt"> {}
export interface ApiUpdate extends Partial<Omit<Api, "id" | "createdAt">> {}
export interface ApiFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface ApiListResponse { data: Api[]; total: number; page: number; limit: number; }
export type ApiStatus = "ativo" | "inativo" | "pendente" | "cancelado";
