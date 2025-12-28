/**
 * Types para Encargo
 * Departamento Pessoal
 */

export interface Encargo {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: EncargoStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type EncargoStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface EncargoCreate extends Omit<Encargo, 'id' | 'createdAt' | 'updatedAt'> {}

export interface EncargoUpdate extends Partial<EncargoCreate> {}

export interface EncargoFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: EncargoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface EncargoListResponse {
  data: Encargo[];
  total: number;
  page: number;
  limit: number;
}

export default Encargo;
