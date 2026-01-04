export interface PlanoSaude {
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

export interface PlanoSaudeCreate extends Omit<PlanoSaude, "id" | "createdAt" | "updatedAt"> {}
export interface PlanoSaudeUpdate extends Partial<Omit<PlanoSaude, "id" | "createdAt">> {}
export interface PlanoSaudeFilter { search?: string; ativo?: boolean; page?: number; limit?: number; orderBy?: string; order?: "asc" | "desc"; }
export interface PlanoSaudeListResponse { data: PlanoSaude[]; total: number; page: number; limit: number; totalPages: number; }
export type PlanoSaudeStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";
