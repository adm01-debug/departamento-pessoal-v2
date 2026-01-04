export interface Dependente {
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
export interface DependenteCreate extends Omit<Dependente, "id" | "createdAt" | "updatedAt"> {}
export interface DependenteUpdate extends Partial<Omit<Dependente, "id" | "createdAt">> {}
export interface DependenteFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface DependenteListResponse { data: Dependente[]; total: number; page: number; limit: number; }
export type DependenteStatus = "ativo" | "inativo" | "pendente" | "cancelado";
