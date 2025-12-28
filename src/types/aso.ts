/**
 * Types para Aso
 * Departamento Pessoal
 */

export interface Aso {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: AsoStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type AsoStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface AsoCreate extends Omit<Aso, 'id' | 'createdAt' | 'updatedAt'> {}

export interface AsoUpdate extends Partial<AsoCreate> {}

export interface AsoFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: AsoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface AsoListResponse {
  data: Aso[];
  total: number;
  page: number;
  limit: number;
}

export default Aso;
