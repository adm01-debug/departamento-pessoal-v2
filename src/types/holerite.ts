/**
 * Types para Holerite
 * Departamento Pessoal
 */

export interface Holerite {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: HoleriteStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type HoleriteStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface HoleriteCreate extends Omit<Holerite, 'id' | 'createdAt' | 'updatedAt'> {}

export interface HoleriteUpdate extends Partial<HoleriteCreate> {}

export interface HoleriteFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: HoleriteStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface HoleriteListResponse {
  data: Holerite[];
  total: number;
  page: number;
  limit: number;
}

export default Holerite;
