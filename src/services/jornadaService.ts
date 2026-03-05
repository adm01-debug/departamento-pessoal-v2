// @ts-nocheck
// V17-S011: JornadaService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface Jornada {
  id: string; empresa_id: string; nome: string; descricao?: string;
  carga_horaria_semanal: number; entrada: string; saida: string;
  intervalo_inicio?: string; intervalo_fim?: string; tolerancia_minutos: number;
  ativa: boolean; created_at: string; updated_at: string;
}

export const jornadaServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('jornadas').select('*').eq('empresa_id', empresaId).order('nome');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('jornadas').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(jornada: Partial<Jornada>) {
    const { data, error } = await supabase.from('jornadas').insert({ ...jornada, ativa: true }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, jornada: Partial<Jornada>) {
    const { data, error } = await supabase.from('jornadas').update({ ...jornada, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('jornadas').update({ ativa: false }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async getAtivas(empresaId: string) {
    const { data, error } = await supabase.from('jornadas').select('*').eq('empresa_id', empresaId).eq('ativa', true);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default jornadaServiceReal;
