/**
 * Tipos de Documento
 * Database Types for documento
 */

import { Database } from './database.types';

export type documentoRow = Database['public']['Tables']['documento']['Row'];
export type documentoInsert = Database['public']['Tables']['documento']['Insert'];
export type documentoUpdate = Database['public']['Tables']['documento']['Update'];

export interface documentoWithRelations extends documentoRow {
  // Add relations here
}

export type documentoFilter = Partial<Pick<documentoRow, 'id' | 'created_at'>>;

export interface documentoPagination {
  page: number;
  limit: number;
  total: number;
  data: documentoRow[];
}
