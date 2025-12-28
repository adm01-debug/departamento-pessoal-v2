/**
 * Tipos de Usuário
 * Database Types for usuario
 */

import { Database } from './database.types';

export type usuarioRow = Database['public']['Tables']['usuario']['Row'];
export type usuarioInsert = Database['public']['Tables']['usuario']['Insert'];
export type usuarioUpdate = Database['public']['Tables']['usuario']['Update'];

export interface usuarioWithRelations extends usuarioRow {
  // Add relations here
}

export type usuarioFilter = Partial<Pick<usuarioRow, 'id' | 'created_at'>>;

export interface usuarioPagination {
  page: number;
  limit: number;
  total: number;
  data: usuarioRow[];
}
