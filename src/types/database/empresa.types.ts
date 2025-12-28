/**
 * Tipos de Empresa
 * Database Types for empresa
 */

import { Database } from './database.types';

export type empresaRow = Database['public']['Tables']['empresa']['Row'];
export type empresaInsert = Database['public']['Tables']['empresa']['Insert'];
export type empresaUpdate = Database['public']['Tables']['empresa']['Update'];

export interface empresaWithRelations extends empresaRow {
  // Add relations here
}

export type empresaFilter = Partial<Pick<empresaRow, 'id' | 'created_at'>>;

export interface empresaPagination {
  page: number;
  limit: number;
  total: number;
  data: empresaRow[];
}
