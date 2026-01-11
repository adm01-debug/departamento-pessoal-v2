// V15-208: src/services/empresaService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Empresa, EmpresaFormData } from '@/types';

export const empresaService = {
  async list() {
    const { data, error } = await supabase.from('empresas').select('*').order('razao_social');
    if (error) throw error;
    return data as Empresa[];
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Empresa;
  },

  async create(data: EmpresaFormData) {
    const { data: created, error } = await supabase.from('empresas').insert(data).select().single();
    if (error) throw error;
    return created as Empresa;
  },

  async update(id: string, data: Partial<EmpresaFormData>) {
    const { data: updated, error } = await supabase.from('empresas').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Empresa;
  },

  async delete(id: string) {
    const { error } = await supabase.from('empresas').delete().eq('id', id);
    if (error) throw error;
  }
};
