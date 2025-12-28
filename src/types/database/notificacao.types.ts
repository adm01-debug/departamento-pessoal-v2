/**
 * Tipos de Notificação
 * Database Types for notificacao
 */

import { Database } from './database.types';

export type notificacaoRow = Database['public']['Tables']['notificacao']['Row'];
export type notificacaoInsert = Database['public']['Tables']['notificacao']['Insert'];
export type notificacaoUpdate = Database['public']['Tables']['notificacao']['Update'];

export interface notificacaoWithRelations extends notificacaoRow {
  // Add relations here
}

export type notificacaoFilter = Partial<Pick<notificacaoRow, 'id' | 'created_at'>>;

export interface notificacaoPagination {
  page: number;
  limit: number;
  total: number;
  data: notificacaoRow[];
}
