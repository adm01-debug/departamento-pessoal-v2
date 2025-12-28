/**
 * Types para Guia
 * Departamento Pessoal
 */

export interface Guia {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: GuiaStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type GuiaStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface GuiaCreate extends Omit<Guia, 'id' | 'createdAt' | 'updatedAt'> {}

export interface GuiaUpdate extends Partial<GuiaCreate> {}

export interface GuiaFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: GuiaStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface GuiaListResponse {
  data: Guia[];
  total: number;
  page: number;
  limit: number;
}

export default Guia;
