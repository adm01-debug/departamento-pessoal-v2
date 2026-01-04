export interface Ui {
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
export interface UiCreate extends Omit<Ui, "id" | "createdAt" | "updatedAt"> {}
export interface UiUpdate extends Partial<Omit<Ui, "id" | "createdAt">> {}
export interface UiFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface UiListResponse { data: Ui[]; total: number; page: number; limit: number; }
export type UiStatus = "ativo" | "inativo" | "pendente" | "cancelado";
