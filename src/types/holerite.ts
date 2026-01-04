export interface Holerite {
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
export interface HoleriteCreate extends Omit<Holerite, "id" | "createdAt" | "updatedAt"> {}
export interface HoleriteUpdate extends Partial<Omit<Holerite, "id" | "createdAt">> {}
export interface HoleriteFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface HoleriteListResponse { data: Holerite[]; total: number; page: number; limit: number; }
export type HoleriteStatus = "ativo" | "inativo" | "pendente" | "cancelado";
