/**
 * Tipos de Permissão
 * Database Types for permissao
 */

import { Database } from './database.types';

export type permissaoRow = Database['public']['Tables']['permissao']['Row'];
export type permissaoInsert = Database['public']['Tables']['permissao']['Insert'];
export type permissaoUpdate = Database['public']['Tables']['permissao']['Update'];

export interface permissaoWithRelations extends permissaoRow {
  // Add relations here
}

export type permissaoFilter = Partial<Pick<permissaoRow, 'id' | 'created_at'>>;

export interface permissaoPagination {
  page: number;
  limit: number;
  total: number;
  data: permissaoRow[];
}
