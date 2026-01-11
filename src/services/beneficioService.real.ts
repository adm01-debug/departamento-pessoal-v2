// V16-018: BeneficioService - Production Ready
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Beneficio, Insertable, Updatable } from '@/integrations/supabase/database.types';

export const beneficioServiceReal = {
  async getAll(empresaId: string): Promise<Beneficio[]> {
    const { data, error } = await supabase.from('beneficios').select('*').eq('empresa_id', empresaId).eq('ativo', true).order('nome');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string): Promise<Beneficio | null> {
    const { data, error } = await supabase.from('beneficios').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(beneficio: Insertable<'beneficios'>): Promise<Beneficio> {
    const { data, error } = await supabase.from('beneficios').insert(beneficio).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, beneficio: Updatable<'beneficios'>): Promise<Beneficio> {
    const { data, error } = await supabase.from('beneficios').update(beneficio).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('beneficios').update({ ativo: false }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async vincularColaborador(colaboradorId: string, beneficioId: string, valor: number): Promise<void> {
    const { error } = await supabase.from('colaborador_beneficios').insert({ colaborador_id: colaboradorId, beneficio_id: beneficioId, valor, data_inicio: new Date().toISOString().split('T')[0] });
    if (error) throw new Error(handleSupabaseError(error));
  },
};
export default beneficioServiceReal;
