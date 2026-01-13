// V16-016: DepartamentoService - Production Ready
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Departamento, Insertable, Updatable } from '@/integrations/supabase/database.types';

export const departamentoServiceReal = {
  async getAll(empresaId: string): Promise<Departamento[]> {
    const { data, error } = await supabase.from('departamentos').select('*').eq('empresa_id', empresaId).eq('ativo', true).order('nome');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string): Promise<Departamento | null> {
    const { data, error } = await supabase.from('departamentos').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(depto: Insertable<'departamentos'>): Promise<Departamento> {
    const { data, error } = await supabase.from('departamentos').insert(depto).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, depto: Updatable<'departamentos'>): Promise<Departamento> {
    const { data, error } = await supabase.from('departamentos').update(depto).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('departamentos').update({ ativo: false }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
};
export default departamentoServiceReal;
