// V17-S013: VinculoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Vinculo { id: string; colaborador_id: string; tipo: string; categoria: string; data_inicio: string; data_fim?: string; matricula: string; status: string; }
export const vinculoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('vinculos').select('*').eq('colaborador_id', colaboradorId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(vinculo: Partial<Vinculo>) { const { data, error } = await supabase.from('vinculos').insert(vinculo).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async update(id: string, vinculo: Partial<Vinculo>) { const { data, error } = await supabase.from('vinculos').update(vinculo).eq('id', id).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
}; export default vinculoServiceReal;
