export interface Relatorio {
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
export interface RelatorioCreate extends Omit<Relatorio, "id" | "createdAt" | "updatedAt"> {}
export interface RelatorioUpdate extends Partial<Omit<Relatorio, "id" | "createdAt">> {}
export interface RelatorioFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface RelatorioListResponse { data: Relatorio[]; total: number; page: number; limit: number; }
export type RelatorioStatus = "ativo" | "inativo" | "pendente" | "cancelado";
