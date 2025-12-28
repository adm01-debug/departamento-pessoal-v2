/**
 * Tipos de eSocial
 * Database Types for esocial
 */

import { Database } from './database.types';

export type esocialRow = Database['public']['Tables']['esocial']['Row'];
export type esocialInsert = Database['public']['Tables']['esocial']['Insert'];
export type esocialUpdate = Database['public']['Tables']['esocial']['Update'];

export interface esocialWithRelations extends esocialRow {
  // Add relations here
}

export type esocialFilter = Partial<Pick<esocialRow, 'id' | 'created_at'>>;

export interface esocialPagination {
  page: number;
  limit: number;
  total: number;
  data: esocialRow[];
}
