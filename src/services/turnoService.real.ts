// V17-S017: TurnoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Turno { id: string; empresa_id: string; nome: string; hora_inicio: string; hora_fim: string; noturno: boolean; }
export const turnoServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('turnos').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(turno: Partial<Turno>) { const { data, error } = await supabase.from('turnos').insert(turno).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
}; export default turnoServiceReal;
