/**
 * Tipos de Ponto
 * Database Types for ponto
 */

import { Database } from './database.types';

export type pontoRow = Database['public']['Tables']['ponto']['Row'];
export type pontoInsert = Database['public']['Tables']['ponto']['Insert'];
export type pontoUpdate = Database['public']['Tables']['ponto']['Update'];

export interface pontoWithRelations extends pontoRow {
  // Add relations here
}

export type pontoFilter = Partial<Pick<pontoRow, 'id' | 'created_at'>>;

export interface pontoPagination {
  page: number;
  limit: number;
  total: number;
  data: pontoRow[];
}
