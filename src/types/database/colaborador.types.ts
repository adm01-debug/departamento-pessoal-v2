/**
 * Tipos de Colaborador
 * Database Types for colaborador
 */

import { Database } from './database.types';

export type colaboradorRow = Database['public']['Tables']['colaborador']['Row'];
export type colaboradorInsert = Database['public']['Tables']['colaborador']['Insert'];
export type colaboradorUpdate = Database['public']['Tables']['colaborador']['Update'];

export interface colaboradorWithRelations extends colaboradorRow {
  // Add relations here
}

export type colaboradorFilter = Partial<Pick<colaboradorRow, 'id' | 'created_at'>>;

export interface colaboradorPagination {
  page: number;
  limit: number;
  total: number;
  data: colaboradorRow[];
}
