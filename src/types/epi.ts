/**
 * Types para Epi
 * Departamento Pessoal
 */

export interface Epi {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: EpiStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type EpiStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface EpiCreate extends Omit<Epi, 'id' | 'createdAt' | 'updatedAt'> {}

export interface EpiUpdate extends Partial<EpiCreate> {}

export interface EpiFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: EpiStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface EpiListResponse {
  data: Epi[];
  total: number;
  page: number;
  limit: number;
}

export default Epi;
