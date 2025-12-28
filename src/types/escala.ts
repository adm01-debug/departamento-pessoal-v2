/**
 * Types para Escala
 * Departamento Pessoal
 */

export interface Escala {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: EscalaStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type EscalaStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface EscalaCreate extends Omit<Escala, 'id' | 'createdAt' | 'updatedAt'> {}

export interface EscalaUpdate extends Partial<EscalaCreate> {}

export interface EscalaFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: EscalaStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface EscalaListResponse {
  data: Escala[];
  total: number;
  page: number;
  limit: number;
}

export default Escala;
