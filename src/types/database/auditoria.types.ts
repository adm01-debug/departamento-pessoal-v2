/**
 * Tipos de Auditoria
 * Database Types for auditoria
 */

import { Database } from './database.types';

export type auditoriaRow = Database['public']['Tables']['auditoria']['Row'];
export type auditoriaInsert = Database['public']['Tables']['auditoria']['Insert'];
export type auditoriaUpdate = Database['public']['Tables']['auditoria']['Update'];

export interface auditoriaWithRelations extends auditoriaRow {
  // Add relations here
}

export type auditoriaFilter = Partial<Pick<auditoriaRow, 'id' | 'created_at'>>;

export interface auditoriaPagination {
  page: number;
  limit: number;
  total: number;
  data: auditoriaRow[];
}
