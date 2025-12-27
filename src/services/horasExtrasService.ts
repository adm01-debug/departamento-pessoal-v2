import { supabase } from '@/integrations/supabase/client';

export const horasExtrasService = {
  async getAll() {
    const { data, error } = await supabase.from('horasExtras').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('horasExtras').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('horasExtras').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('horasExtras').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('horasExtras').delete().eq('id', id);
    if (error) throw error;
  },
};
export default horasExtrasService;
