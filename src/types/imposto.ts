/**
 * Types para Imposto
 * Departamento Pessoal
 */

export interface Imposto {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: ImpostoStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type ImpostoStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface ImpostoCreate extends Omit<Imposto, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ImpostoUpdate extends Partial<ImpostoCreate> {}

export interface ImpostoFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: ImpostoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface ImpostoListResponse {
  data: Imposto[];
  total: number;
  page: number;
  limit: number;
}

export default Imposto;
