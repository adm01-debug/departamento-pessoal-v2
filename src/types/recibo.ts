/**
 * Types para Recibo
 * Departamento Pessoal
 */

export interface Recibo {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: ReciboStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type ReciboStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface ReciboCreate extends Omit<Recibo, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ReciboUpdate extends Partial<ReciboCreate> {}

export interface ReciboFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: ReciboStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface ReciboListResponse {
  data: Recibo[];
  total: number;
  page: number;
  limit: number;
}

export default Recibo;
