/**
 * Types para Jornada
 * Departamento Pessoal
 */

export interface Jornada {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: JornadaStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type JornadaStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface JornadaCreate extends Omit<Jornada, 'id' | 'createdAt' | 'updatedAt'> {}

export interface JornadaUpdate extends Partial<JornadaCreate> {}

export interface JornadaFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: JornadaStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface JornadaListResponse {
  data: Jornada[];
  total: number;
  page: number;
  limit: number;
}

export default Jornada;
