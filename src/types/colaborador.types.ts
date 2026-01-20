// V21: Tipos TypeScript para Colaborador
export interface Colaborador {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColaboradorCreateInput {
  // Campos para criacao
}

export interface ColaboradorUpdateInput {
  // Campos para atualizacao
}

export interface ColaboradorFilters {
  // Filtros de busca
  page?: number;
  limit?: number;
  search?: string;
}

export type ColaboradorStatus = 'ativo' | 'inativo' | 'pendente';
