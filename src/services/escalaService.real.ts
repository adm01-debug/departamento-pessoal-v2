// V17-S016: EscalaService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Escala { id: string; empresa_id: string; nome: string; tipo: string; dias_trabalho: number[]; folgas: number[]; }
export const escalaServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('escalas').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(escala: Partial<Escala>) { const { data, error } = await supabase.from('escalas').insert(escala).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async update(id: string, escala: Partial<Escala>) { const { data, error } = await supabase.from('escalas').update(escala).eq('id', id).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
}; export default escalaServiceReal;
