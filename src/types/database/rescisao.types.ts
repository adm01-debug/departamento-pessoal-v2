/**
 * Tipos de Rescisão
 * Database Types for rescisao
 */

import { Database } from './database.types';

export type rescisaoRow = Database['public']['Tables']['rescisao']['Row'];
export type rescisaoInsert = Database['public']['Tables']['rescisao']['Insert'];
export type rescisaoUpdate = Database['public']['Tables']['rescisao']['Update'];

export interface rescisaoWithRelations extends rescisaoRow {
  // Add relations here
}

export type rescisaoFilter = Partial<Pick<rescisaoRow, 'id' | 'created_at'>>;

export interface rescisaoPagination {
  page: number;
  limit: number;
  total: number;
  data: rescisaoRow[];
}
