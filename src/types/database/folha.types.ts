/**
 * Tipos de Folha
 * Database Types for folha
 */

import { Database } from './database.types';

export type folhaRow = Database['public']['Tables']['folha']['Row'];
export type folhaInsert = Database['public']['Tables']['folha']['Insert'];
export type folhaUpdate = Database['public']['Tables']['folha']['Update'];

export interface folhaWithRelations extends folhaRow {
  // Add relations here
}

export type folhaFilter = Partial<Pick<folhaRow, 'id' | 'created_at'>>;

export interface folhaPagination {
  page: number;
  limit: number;
  total: number;
  data: folhaRow[];
}
