import { supabase } from '@/integrations/supabase/client';

export const sindicatoService = {
  async getAll() {
    const { data, error } = await supabase.from('sindicato').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('sindicato').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('sindicato').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('sindicato').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('sindicato').delete().eq('id', id);
    if (error) throw error;
  },
};
export default sindicatoService;
