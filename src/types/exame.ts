/**
 * Types para Exame
 * Departamento Pessoal
 */

export interface Exame {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: ExameStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type ExameStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface ExameCreate extends Omit<Exame, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ExameUpdate extends Partial<ExameCreate> {}

export interface ExameFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: ExameStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface ExameListResponse {
  data: Exame[];
  total: number;
  page: number;
  limit: number;
}

export default Exame;
