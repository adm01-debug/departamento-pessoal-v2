// V15-207: src/services/colaboradorService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Colaborador, ColaboradorFormData, ColaboradorFilters } from '@/types';

export const colaboradorService = {
  async list(filters?: ColaboradorFilters) {
    let query = supabase.from('colaboradores').select('*').order('nome');
    if (filters?.search) query = query.ilike('nome', `%${filters.search}%`);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.departamento_id) query = query.eq('departamento_id', filters.departamento_id);
    const { data, error } = await query;
    if (error) throw error;
    return data as Colaborador[];
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('colaboradores').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Colaborador;
  },

  async create(data: ColaboradorFormData) {
    const { data: created, error } = await supabase.from('colaboradores').insert(data).select().single();
    if (error) throw error;
    return created as Colaborador;
  },

  async update(id: string, data: Partial<ColaboradorFormData>) {
    const { data: updated, error } = await supabase.from('colaboradores').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Colaborador;
  },

  async delete(id: string) {
    const { error } = await supabase.from('colaboradores').delete().eq('id', id);
    if (error) throw error;
  },

  async count(filters?: ColaboradorFilters) {
    let query = supabase.from('colaboradores').select('id', { count: 'exact', head: true });
    if (filters?.status) query = query.eq('status', filters.status);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};
