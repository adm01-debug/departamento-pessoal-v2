/**
 * Tipos de Benefício
 * Database Types for beneficio
 */

import { Database } from './database.types';

export type beneficioRow = Database['public']['Tables']['beneficio']['Row'];
export type beneficioInsert = Database['public']['Tables']['beneficio']['Insert'];
export type beneficioUpdate = Database['public']['Tables']['beneficio']['Update'];

export interface beneficioWithRelations extends beneficioRow {
  // Add relations here
}

export type beneficioFilter = Partial<Pick<beneficioRow, 'id' | 'created_at'>>;

export interface beneficioPagination {
  page: number;
  limit: number;
  total: number;
  data: beneficioRow[];
}
