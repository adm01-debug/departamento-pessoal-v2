/**
 * Types para Dependente
 * Departamento Pessoal
 */

export interface Dependente {
  id: string;
  empresaId: string;
  colaboradorId?: string;
  descricao: string;
  valor?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status: DependenteStatus;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type DependenteStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

export interface DependenteCreate extends Omit<Dependente, 'id' | 'createdAt' | 'updatedAt'> {}

export interface DependenteUpdate extends Partial<DependenteCreate> {}

export interface DependenteFilter {
  empresaId?: string;
  colaboradorId?: string;
  status?: DependenteStatus;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

export interface DependenteListResponse {
  data: Dependente[];
  total: number;
  page: number;
  limit: number;
}

export default Dependente;
