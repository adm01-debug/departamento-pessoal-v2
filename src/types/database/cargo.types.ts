/**
 * Tipos de Cargo
 * Database Types for cargo
 */

import { Database } from './database.types';

export type cargoRow = Database['public']['Tables']['cargo']['Row'];
export type cargoInsert = Database['public']['Tables']['cargo']['Insert'];
export type cargoUpdate = Database['public']['Tables']['cargo']['Update'];

export interface cargoWithRelations extends cargoRow {
  // Add relations here
}

export type cargoFilter = Partial<Pick<cargoRow, 'id' | 'created_at'>>;

export interface cargoPagination {
  page: number;
  limit: number;
  total: number;
  data: cargoRow[];
}
