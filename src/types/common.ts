export interface Common {
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
export interface CommonCreate extends Omit<Common, "id" | "createdAt" | "updatedAt"> {}
export interface CommonUpdate extends Partial<Omit<Common, "id" | "createdAt">> {}
export interface CommonFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface CommonListResponse { data: Common[]; total: number; page: number; limit: number; }
export type CommonStatus = "ativo" | "inativo" | "pendente" | "cancelado";
