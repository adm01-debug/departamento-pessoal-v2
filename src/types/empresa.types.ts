// V21: Tipos TypeScript para Empresa
export interface Empresa {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmpresaCreateInput {
  // Campos para criacao
}

export interface EmpresaUpdateInput {
  // Campos para atualizacao
}

export interface EmpresaFilters {
  // Filtros de busca
  page?: number;
  limit?: number;
  search?: string;
}

export type EmpresaStatus = 'ativo' | 'inativo' | 'pendente';
