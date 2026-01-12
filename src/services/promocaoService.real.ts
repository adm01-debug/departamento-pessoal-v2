// V17-S019: PromocaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Promocao { id: string; colaborador_id: string; cargo_anterior_id: string; cargo_novo_id: string; salario_anterior: number; salario_novo: number; data_vigencia: string; motivo?: string; }
export const promocaoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('promocoes').select('*, cargo_anterior:cargos!cargo_anterior_id(nome), cargo_novo:cargos!cargo_novo_id(nome)').eq('colaborador_id', colaboradorId).order('data_vigencia', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(promocao: Partial<Promocao>) { const { data, error } = await supabase.from('promocoes').insert(promocao).select().single(); if (error) throw new Error(handleSupabaseError(error)); await supabase.from('colaboradores').update({ cargo_id: promocao.cargo_novo_id, salario: promocao.salario_novo }).eq('id', promocao.colaborador_id); return data; }
}; export default promocaoServiceReal;
