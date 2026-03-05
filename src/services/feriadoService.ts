// @ts-nocheck
// V17-S015: FeriadoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Feriado { id: string; empresa_id?: string; nome: string; data: string; tipo: 'nacional' | 'estadual' | 'municipal' | 'ponto_facultativo'; recorrente: boolean; }
export const feriadoServiceReal = {
  async getAll(empresaId?: string) { let query = supabase.from('feriados').select('*').order('data'); if (empresaId) query = query.or(`empresa_id.eq.${empresaId},empresa_id.is.null`); const { data, error } = await query; if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async getByAno(ano: number, empresaId?: string) { const feriados = await this.getAll(empresaId); return feriados.filter(f => f.data.startsWith(String(ano)) || f.recorrente); },
  async create(feriado: Partial<Feriado>) { const { data, error } = await supabase.from('feriados').insert(feriado).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async delete(id: string) { const { error } = await supabase.from('feriados').delete().eq('id', id); if (error) throw new Error(handleSupabaseError(error)); }
}; export default feriadoServiceReal;
