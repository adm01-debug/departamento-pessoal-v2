export interface Configuracao {
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
export interface ConfiguracaoCreate extends Omit<Configuracao, "id" | "createdAt" | "updatedAt"> {}
export interface ConfiguracaoUpdate extends Partial<Omit<Configuracao, "id" | "createdAt">> {}
export interface ConfiguracaoFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface ConfiguracaoListResponse { data: Configuracao[]; total: number; page: number; limit: number; }
export type ConfiguracaoStatus = "ativo" | "inativo" | "pendente" | "cancelado";
