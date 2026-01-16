// V18-FIX: BeneficioService - Production Ready with Supabase
// Atualizado em 16/01/2026 - Adicionado método list
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Beneficio, Insertable, Updatable } from '@/integrations/supabase/database.types';

export interface BeneficioWithVinculos extends Beneficio {
  vinculos?: Array<{ colaborador_id: string; colaborador?: { nome: string } }>;
}

export interface BeneficioFilters {
  empresa_id?: string;
  tipo?: string;
  ativo?: boolean;
}

export const beneficioServiceReal = {
  async getAll(filters: BeneficioFilters = {}): Promise<Beneficio[]> {
    let query = supabase
      .from('beneficios')
      .select('*')
      .order('nome');

    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
    if (filters.tipo) query = query.eq('tipo', filters.tipo);
    if (filters.ativo !== undefined) query = query.eq('ativo', filters.ativo);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Alias para compatibilidade com BeneficiosPage
  async list(filters?: BeneficioFilters): Promise<Beneficio[]> {
    return this.getAll(filters || {});
  },

  async getById(id: string): Promise<BeneficioWithVinculos | null> {
    const { data, error } = await supabase
      .from('beneficios')
      .select(`
        *,
        vinculos:colaborador_beneficios(colaborador_id, colaborador:colaboradores(nome))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data as BeneficioWithVinculos;
  },

  async create(beneficio: Insertable<'beneficios'>): Promise<Beneficio> {
    const { data, error } = await supabase
      .from('beneficios')
      .insert(beneficio)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, beneficio: Updatable<'beneficios'>): Promise<Beneficio> {
    const { data, error } = await supabase
      .from('beneficios')
      .update({ ...beneficio, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('beneficios').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },

  async vincularColaborador(beneficioId: string, colaboradorId: string): Promise<void> {
    const { error } = await supabase
      .from('colaborador_beneficios')
      .insert({ beneficio_id: beneficioId, colaborador_id: colaboradorId });
    if (error) throw new Error(handleSupabaseError(error));
  },

  async desvincularColaborador(beneficioId: string, colaboradorId: string): Promise<void> {
    const { error } = await supabase
      .from('colaborador_beneficios')
      .delete()
      .eq('beneficio_id', beneficioId)
      .eq('colaborador_id', colaboradorId);
    if (error) throw new Error(handleSupabaseError(error));
  },
};

export default beneficioServiceReal;
