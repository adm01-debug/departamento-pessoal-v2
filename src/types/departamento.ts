/**
 * @fileoverview Tipos para gestão de departamentos
 * @module types/departamento
 */

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  gestor_id?: string;
  gestor_nome?: string;
  empresa_id?: string;
  parent_id?: string;
  nivel?: number;
  ativo?: boolean;
  created_at?: string;
}

export interface DepartamentoFormData extends Omit<Departamento, 'id' | 'created_at' | 'gestor_nome'> {}

export interface DepartamentoFilters {
  empresa_id?: string;
  ativo?: boolean;
  search?: string;
}

export interface DepartamentoStats {
  id: string;
  nome: string;
  total_colaboradores: number;
  colaboradores_ativos: number;
  colaboradores_afastados: number;
}

