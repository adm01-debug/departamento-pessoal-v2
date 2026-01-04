export interface Admissao {
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
export interface AdmissaoCreate extends Omit<Admissao, "id" | "createdAt" | "updatedAt"> {}
export interface AdmissaoUpdate extends Partial<Omit<Admissao, "id" | "createdAt">> {}
export interface AdmissaoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface AdmissaoListResponse { data: Admissao[]; total: number; page: number; limit: number; }
export type AdmissaoStatus = "ativo" | "inativo" | "pendente" | "cancelado";
