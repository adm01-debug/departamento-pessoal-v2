/**
 * Types para Turno
 * Departamento Pessoal
 */

export interface Turno {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: TurnoStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type TurnoStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface TurnoCreate extends Omit<Turno, 'id' | 'createdAt' | 'updatedAt'> {}

export interface TurnoUpdate extends Partial<TurnoCreate> {}

export interface TurnoFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: TurnoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface TurnoListResponse {
  data: Turno[];
  total: number;
  page: number;
  limit: number;
}

export default Turno;
