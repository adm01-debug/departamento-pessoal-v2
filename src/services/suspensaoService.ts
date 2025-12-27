import { supabase } from '@/integrations/supabase/client';

export const suspensaoService = {
  async getAll() {
    const { data, error } = await supabase.from('suspensao').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('suspensao').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('suspensao').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('suspensao').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('suspensao').delete().eq('id', id);
    if (error) throw error;
  },
};
export default suspensaoService;
