// V21: Tipos TypeScript para FolhaPagamento
export interface FolhaPagamento {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolhaPagamentoCreateInput {
  // Campos para criacao
}

export interface FolhaPagamentoUpdateInput {
  // Campos para atualizacao
}

export interface FolhaPagamentoFilters {
  // Filtros de busca
  page?: number;
  limit?: number;
  search?: string;
}

export type FolhaPagamentoStatus = 'ativo' | 'inativo' | 'pendente';
