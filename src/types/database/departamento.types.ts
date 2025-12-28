/**
 * Tipos de Departamento
 * Database Types for departamento
 */

import { Database } from './database.types';

export type departamentoRow = Database['public']['Tables']['departamento']['Row'];
export type departamentoInsert = Database['public']['Tables']['departamento']['Insert'];
export type departamentoUpdate = Database['public']['Tables']['departamento']['Update'];

export interface departamentoWithRelations extends departamentoRow {
  // Add relations here
}

export type departamentoFilter = Partial<Pick<departamentoRow, 'id' | 'created_at'>>;

export interface departamentoPagination {
  page: number;
  limit: number;
  total: number;
  data: departamentoRow[];
}
