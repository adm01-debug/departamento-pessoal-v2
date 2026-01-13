// V16-017: CargoService - Production Ready
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Cargo, Insertable, Updatable } from '@/integrations/supabase/database.types';

export const cargoServiceReal = {
  async getAll(empresaId: string): Promise<Cargo[]> {
    const { data, error } = await supabase.from('cargos').select('*').eq('empresa_id', empresaId).eq('ativo', true).order('nome');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string): Promise<Cargo | null> {
    const { data, error } = await supabase.from('cargos').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(cargo: Insertable<'cargos'>): Promise<Cargo> {
    const { data, error } = await supabase.from('cargos').insert(cargo).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, cargo: Updatable<'cargos'>): Promise<Cargo> {
    const { data, error } = await supabase.from('cargos').update(cargo).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('cargos').update({ ativo: false }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
};
export default cargoServiceReal;
