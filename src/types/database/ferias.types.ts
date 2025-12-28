/**
 * Tipos de Férias
 * Database Types for ferias
 */

import { Database } from './database.types';

export type feriasRow = Database['public']['Tables']['ferias']['Row'];
export type feriasInsert = Database['public']['Tables']['ferias']['Insert'];
export type feriasUpdate = Database['public']['Tables']['ferias']['Update'];

export interface feriasWithRelations extends feriasRow {
  // Add relations here
}

export type feriasFilter = Partial<Pick<feriasRow, 'id' | 'created_at'>>;

export interface feriasPagination {
  page: number;
  limit: number;
  total: number;
  data: feriasRow[];
}
